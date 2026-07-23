const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const psScriptContent = `
$code = @"
using System;
using System.Runtime.InteropServices;
using System.Diagnostics;
public class RamCleaner {
    [DllImport("ntdll.dll")]
    public static extern uint NtSetSystemInformation(int InfoClass, IntPtr Info, int Length);

    [DllImport("advapi32.dll", ExactSpelling = true, SetLastError = true)]
    internal static extern bool AdjustTokenPrivileges(IntPtr htok, bool disall, ref TokPriv1Luid newst, int len, IntPtr prev, IntPtr relen);

    [DllImport("advapi32.dll", ExactSpelling = true, SetLastError = true)]
    internal static extern bool OpenProcessToken(IntPtr h, int acc, ref IntPtr phtok);

    [DllImport("advapi32.dll", SetLastError = true)]
    internal static extern bool LookupPrivilegeValue(string host, string name, ref long pluid);

    [StructLayout(LayoutKind.Sequential, Pack = 1)]
    internal struct TokPriv1Luid {
        public int Count;
        public long Luid;
        public int Attr;
    }

    public static void Clean() {
        IntPtr hToken = IntPtr.Zero;
        if (OpenProcessToken(Process.GetCurrentProcess().Handle, 0x0020 | 0x0008, ref hToken)) {
            TokPriv1Luid tp;
            tp.Count = 1;
            tp.Luid = 0;
            tp.Attr = 2;
            LookupPrivilegeValue(null, "SeProfileSingleProcessPrivilege", ref tp.Luid);
            AdjustTokenPrivileges(hToken, false, ref tp, 0, IntPtr.Zero, IntPtr.Zero);
        }

        IntPtr ptr = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(int)));
        Marshal.WriteInt32(ptr, 4); // MemoryPurgeStandbyList
        NtSetSystemInformation(80, ptr, Marshal.SizeOf(typeof(int))); // SystemMemoryListInformation
        Marshal.FreeHGlobal(ptr);
    }
}
"@
Add-Type -TypeDefinition $code
[RamCleaner]::Clean()
`;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 420,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    resizable: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0f172a',
      symbolColor: '#ffffff',
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('clean-ram', async () => {
  return new Promise((resolve) => {
    const tempScriptPath = path.join(app.getPath('temp'), 'clean-ram.ps1');
    
    try {
      fs.writeFileSync(tempScriptPath, psScriptContent);
    } catch (e) {
      resolve({ success: false, message: 'Falha ao criar o arquivo temporário.' });
      return;
    }

    const command = `powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', '\\"${tempScriptPath}\\"' -Verb RunAs -Wait"`;

    exec(command, (error, stdout, stderr) => {
      try {
        if (fs.existsSync(tempScriptPath)) {
          fs.unlinkSync(tempScriptPath);
        }
      } catch (e) {}

      if (error) {
        resolve({ success: false, message: 'Processo cancelado ou falhou. Dê permissão de administrador.' });
        return;
      }

      resolve({ success: true, message: 'Memória limpa com sucesso!' });
    });
  });
});

ipcMain.handle('clean-temp', async () => {
  return new Promise(async (resolve) => {
    const tempDir = app.getPath('temp');
    let deletedCount = 0;
    let failedCount = 0;

    try {
      const files = await fs.promises.readdir(tempDir);
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        try {
          await fs.promises.rm(filePath, { recursive: true, force: true });
          deletedCount++;
        } catch (e) {
          failedCount++;
        }
      }
      resolve({ success: true, message: `Limpos ${deletedCount} itens. (${failedCount} em uso)` });
    } catch (e) {
      resolve({ success: false, message: 'Falha ao acessar a pasta temporária.' });
    }
  });
});
