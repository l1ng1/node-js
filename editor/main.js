const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const fs = require('fs');
const html2rtf = require('html-to-rtf');
const { convertRtfToHtml } = require('html-to-text');
const rtfParser = require('rtf-parser');








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
    convertRtfToHtmlString(fname);

}






function convertRtfToHtmlString(rtfFilePath) {
  try {
    const rtfBuffer = fs.readFileSync(rtfFilePath);
    const parsedResult = rtfParser.parse(rtfBuffer);
    console.log(parsedResult);
    let htmlString = '';

    parsedResult.content.forEach((element) => {
      if (element.type === 'group') {
        htmlString += convertGroupToHtml(element);
      }
    });

    return htmlString;
  } catch (error) {
    console.error('Error converting RTF to HTML:', error);
    return null;
  }
}



function convertGroupToHtml(group) {
  let htmlString = '';

  group.content.forEach((element) => {
    if (element.type === 'text') {
      htmlString += element.content;
    } else if (element.type === 'group') {
      htmlString += convertGroupToHtml(element);
    }
   
  });

  return htmlString;
}
