const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const fs = require('fs');
const html2rtf = require('html-to-rtf');
const { convertRtfToHtml } = require('html-to-text');




const {RtfConverter} = require("read-rtf");
const {RtfParser} = require('read-rtf');


//я перепробовал разные npm пакеты и не с одним из них у меня получилось достичь результата
//я думаю ,это дело в fs.readFile или fs.readFileSync (пробовал оба способа) ,потому что то что я от них получаю 
//больше похоже на шизофринию.Не исключаю того,что это и я могу тупить где-то.Вообщем надеюсь на вас.
//Помогите!!!






function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preloader.js')
        }
        
    });
    win.loadFile('public/index.html');
    // win.loadURL('https://github.com/vitnemikin');
}

app.whenReady()
    .then(() => {
        ipcMain.handle('save', saveTextToFile);
        ipcMain.handle('load',openTextToFile);
        createWindow();
    });

app.on('window-all-closed', app.quit);

function saveTextToFile(ev, text) {
    let rtf = html2rtf.convertHtmlToRtf(text);
    let fname = dialog.showSaveDialogSync();
    if (!fname.endsWith('.rtf')) fname += '.rtf';
    html2rtf.saveRtfInFile(fname, rtf);
}



function openTextToFile(ev) {
    let fname = dialog.showOpenDialogSync().toString();
    convertRtfToHtmlString(fname,(err,data)=>{
        if(err) console.arror('На 59 строке ОШИБКА!!!!!'); return;
        console.log(data);
    })


}



function convertRtfToHtmlString(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(err, null);
        return;
      }
      console.log(data);
      const parser = new RtfParser();
      parser.on('group', (group) => {
        // Передача структуры RTF в html-to-text для преобразования
        convertRtfToHtml(group, (err, html) => {
          if (err) {
            callback(err, null);
            return;
          }
          callback(null, html);
        });
      });
  
      parser.write(data);
    });
  }
