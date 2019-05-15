// Custom Loading Screen
class MyLoadingScreen {
    constructor() {}
    displayLoadingUI() {}
    hideLoadingUI() {}
}

class ModelViewer extends HTMLElement {
    constructor() {
        super();
        // this.style = "display: inline-block";
        this._shadow = this.attachShadow({mode: 'open'})
        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('renderCanvas');
        // Loading Container
        this._loading = document.createElement('div');
        this._loading.classList.add('loadingContainer');
        // Loading Icon
        const loadingIcon = document.createElement('img');
        loadingIcon.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTMuNiAxNTMuNiI+PGNpcmNsZSBjeD0iMTQwLjgiIGN5PSI3Ni44IiByPSIxMi44IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMzIuMjI3IiBjeT0iMTA4LjgiIHI9IjEyLjgiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjEwOC44IiBjeT0iMTMyLjIyNyIgcj0iMTIuOCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNzYuOCIgY3k9IjE0MC44IiByPSIxMi44IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0NC44IiBjeT0iMTMyLjIyNyIgcj0iMTIuOCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMjEuMzczIiBjeT0iMTA4LjgiIHI9IjEyLjgiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjEyLjgiIGN5PSI3Ni44IiByPSIxMi44IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIyMS4zNzMiIGN5PSI0NC44IiByPSIxMi44IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI0NC44IiBjeT0iMjEuMzczIiByPSIxMi44IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI3Ni44IiBjeT0iMTIuOCIgcj0iMTIuOCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTA4LjgiIGN5PSIyMS4zNzMiIHI9IjEyLjgiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjEzMi4yMjciIGN5PSI0NC44IiByPSIxMi44IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=`;
        loadingIcon.classList.add('loadingContainer__icon');
        this._loading.appendChild(loadingIcon);
        // Loading Text
        const loadingText = document.createElement('div');
        loadingText.classList.add('loadingContainer__text');
        this._loading.appendChild(loadingText);
        // Styles
        const style = document.createElement('style');
        style.textContent = `
        :host {
            position: relative;
            display: inline-block;
        }
        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
        .loadingContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: #000;
        }

        .loadingContainer__icon {
            width: 20%;
            height: auto;
            animation: spin 2.5s linear infinite;
        }

        .loadingContainer__text {
            font-family: sans-serif;
            font-size: 12px;
            font-weight: lighter;
            color: #FFF;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        `;
        this._shadow.appendChild(style);
        this._shadow.appendChild(this._canvas);
        this.createScene();
        this.doRender();
    }
    connectedCallback() {
        this._shadow.appendChild(this._loading);
    }

    createScene() {
        // ########## Attributes ##########
        let objUrl = this.getAttribute('src');
        let camRadius = this.getAttribute('camradius') ? Number(this.getAttribute('camradius')) : 30;
    
        let bgColor = this.getAttribute('bgcolor') ? this.getAttribute('bgcolor') : '#FFF';
        let yOffset = this.getAttribute('yoffset') ? Number(this.getAttribute('yoffset')) : 0;
        // ########## Engine ##########
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._engine.loadingScreen = new MyLoadingScreen();
        // ########## Scene ##########
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = BABYLON.Color4.FromHexString(`${bgColor}FF`);
        // ########## Camera ##########
        let mainCamera = new BABYLON.ArcRotateCamera(
            "MainCamera",
            Math.PI / 2, // Alpha
            BABYLON.Angle.FromDegrees(80).radians(), // Beta
            camRadius, // Radius
            new BABYLON.Vector3(0, yOffset, 0), // Target
            this._scene
        );
        mainCamera.attachControl(this._canvas, false);
        // ########## Skybox ##########
        this._scene.createDefaultEnvironment({
            createGround: false,
            sizeAuto: true,
            skyboxSize: 1000,
            skyboxColor: BABYLON.Color4.FromHexString(`${bgColor}FF`)
        });
        // ########## Light ##########
        this._light = new BABYLON.HemisphericLight('MainLight', new BABYLON.Vector3(0, 0, 0), this._scene);
        // ########## Load scene ##########
        BABYLON.SceneLoader.Append(objUrl, '', this._scene, (scene) => {
            this._shadow.removeChild(this._loading);
        }, (progress) => {
            let loaded = Math.round((progress.loaded / progress.total) * 100);
            if(loaded == Infinity) {
                this._loading.querySelector('.loadingContainer__text').style = "display: none;"
            }
            this._loading.querySelector('.loadingContainer__text').textContent = `${loaded}%`;
        });
    }

    doRender() {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    customElements.define("model-viewer", ModelViewer);
});