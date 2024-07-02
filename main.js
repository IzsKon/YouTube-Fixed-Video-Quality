// ==UserScript==
// @name         YouTube Fixed Video Quality
// @description  Remember video quality without any additional user interface.
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       IzsKon
// @match        https://www.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/1384/1384060.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addStyle
// ==/UserScript==

'use strict';
const sleep = ms => new Promise(r => setTimeout(r, ms));

document.addEventListener('yt-navigate-finish', () => {
    if ( window.location.pathname == '/watch' ) {
        setVidQuality();
    }
});

async function setVidQuality() {
    /* Open settings panel. */
    for ( ;; await sleep(200) ) {
        try {
            let settingsButton = document.querySelector('ytd-watch-flexy.style-scope.ytd-page-manager.hide-skeleton .ytp-settings-button');
            settingsButton.click();
            break;
        }
        catch (err) {}
    }

    /* Open quality selection panel. */
    let qualityOptions = [];
    for ( ;; await sleep(200) ) {
        try {
            let settingsPanel = document.querySelector('ytd-watch-flexy.style-scope.ytd-page-manager.hide-skeleton .ytp-panel-menu');
            settingsPanel.lastChild.click();

            let qualityPanel = document.querySelector('div.ytp-panel.ytp-quality-menu');
            qualityOptions = [...qualityPanel.getElementsByClassName('ytp-menuitem')];
            break;
        }
        catch (err) {}
    }

    /* Select video quality. */
    let quality = qualityOptions.length - await GM.getValue( 'videoQuality', 1 );
    qualityOptions[ Math.max(0, quality) ].click();

    /* Add event listener to quality selection. */
    for ( let i = 0; i < qualityOptions.length; ++i ) {
        qualityOptions[i].addEventListener('click', () => {
            GM.setValue( 'videoQuality', qualityOptions.length - i );
        });
    }
}