// import {downloadBlob} from "../utilities/network";
// import {Sound} from "@babylonjs/core";
//
// const blob = await downloadBlob(
//     'https://storage.googleapis.com/sol-ar-world/cello.mp3'
// );
//
// let sound: Sound;
// sound = new Sound(
//     'Cello',
//     await blob.arrayBuffer(),
//     scene,
//     () => {
//         if (!sound.isReady()) {
//             console.error('sound is not ready to play');
//             return;
//         }
//         try {
//             console.log('playing sound');
//             sound.play();
//         } catch (e) {
//             console.error(`error playing sound: ${e}`)
//         }
//     },
// );

export const nothing = 1;