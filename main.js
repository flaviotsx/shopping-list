const electron = 	require('electron');
const url = 		require('url');
const path = 		require('path');

const {app, BrowserWindow, Menu, ipcMain}	= electron;

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
	// Create a new window
	mainWindow = new BrowserWindow({});
	// Load HTML into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Quit app when closed
	mainWindow.on('closed', () => app.quit());

	// Build menu from Template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);
});

// Hendle createAddWindow

function createAddWindow(){
	addWindow = new BrowserWindow({
		width: 300,
		height: 400,
		title: 'Add Item'
	});

	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	addWindow.on('close', () => addWindow = null);
}

// Catch item:add
ipcMain.on('item:add', (e, item) => {
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
});

// Create menu from Template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Add Item',
				accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Clear Items',
				click(){
					mainWindow.webContents.send('item:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		],
	}
];

// If mac, add empty object to menu

if(process.platform == 'darwin'){
	mainMenuTemplate.uinshift({});
}

// Add developer tools item if not in prod

if(process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu:[
			{
				label: 'Toggle Devtools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevtools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}
