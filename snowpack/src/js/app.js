import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import Alpine from 'alpinejs';

window.app = () => {
  return {
    open: false,
    platformMessage: '',
    resultMessage: '',

    showPlatform() {
      this.platformMessage = `<div class="alert alert-dark">${Capacitor.getPlatform()}</div>`;
    },
    async writeFile() {
      try {
        alert(
          (await Filesystem.getUri({
            directory: Directory.Data,
            path: 'secrets/data.txt'
          })).uri
        );

        await Filesystem.writeFile({
          path: 'secrets/data.txt',
          data: '✅ capacitor/filesystem: writeFile',
          directory: Directory.Data,
          recursive: true,
          encoding: Encoding.UTF8
        });

        const content = await Filesystem.readFile({
          path: 'secrets/data.txt',
          directory: Directory.Data,
          recursive: true,
          encoding: Encoding.UTF8 
        });

        console.log(content);
        this.resultMessage = `<div class="alert alert-success">${content.data}</div>`;
      } catch (err) {
        this.resultMessage = `<div class="alert alert-danger">${err.toString()}</div>`;
      }
    }
  }
};

window.Alpine = Alpine;
Alpine.start();
