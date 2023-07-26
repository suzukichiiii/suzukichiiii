let segmentation_results;
let size = 15;
let video;
let pg;
let gotSegmentation;
let downloadButton; // ダウンロードボタンを格納する変数
let backgroundColor = [255, 255, 255];// 背景色を格納する変数
let selectedImage = null; // 選択された画像を格納する変数
let stamps = []; // スタンプとして貼り付けた画像を格納する配列



// 画像を選択したときのイベントリスナーを追加
let stampSelect = document.getElementById('stampSelect');
stampSelect.addEventListener('change', function () {
  let selectedImagePath = stampSelect.value;
  if (selectedImagePath) {
    // 選択された画像を読み込んでselectedImageにセット
    selectedImage = loadImage(selectedImagePath);
  }
});


function setup() {
  pixelDensity(1);
  let p5canvas = createCanvas(400, 400);
  p5canvas.parent('#canvas');

  video = createCapture(VIDEO);
  video.hide();

  pg = createGraphics(400, 400);
  pg.noStroke();





  // 新しい色の選択肢を追加
  let colors = document.getElementById('colors');
  let colorOptions = ["pink", "navy", "yellow", "purple", "salmon", "gray", "blue"]; // 追加したい色のリスト
  for (let color of colorOptions) {
    let option = document.createElement('option');
    option.text = color;
    colors.add(option);
  }


  // 色を選択したときのイベントリスナーを追加
  colors.addEventListener('change', function () {
    let selectedColor = colors.value;
    switch (selectedColor) {
      case "pink":
        backgroundColor = [255, 182, 193];
        break;
      case "navy":
        backgroundColor = [25, 25, 112];
        break;
      case "yellow":
        backgroundColor = [240, 230, 140];
        break;
      case "purple":
        backgroundColor = [106, 90, 205];
        break;
      case "salmon":
        backgroundColor = [250, 128, 114];
        break;
      case "gray":
        backgroundColor = [211, 211, 211];
        break;
      case "blue":
        backgroundColor = [161, 185, 230];
        break;
      default:
        backgroundColor = [255, 255, 255]; // デフォルトの背景色は緑
        break;
    }
  });






  // ダウンロードボタンの作成
  downloadButton = createButton('Download');
  downloadButton.position(146, 750); // ボタンの位置を設定
  downloadButton.mousePressed(downloadSnapshot); // ボタンが押されたときの動作を設定

  // ボタンにスタイルを適用
  downloadButton.style('background-color', 'transparent');
  downloadButton.style('color', 'transparent');
  downloadButton.style('border', 'none');
  downloadButton.style('padding-right', '70px');
  downloadButton.style('padding-bottom', '30px');
  downloadButton.style('display', 'inline-block');
  downloadButton.style('cursor', 'pointer');
  downloadButton.style('transition-duration', '0.4s');
  downloadButton.style('background-image', 'url(./images/download.png)');
  downloadButton.style('background-size', 'cover');
  downloadButton.style('margin-top', '150px');


  gotSegmentation = function (results) {
    pg.clear();


    for (let y = 0; y < video.height; y += size) {
      for (let x = 0; x < video.width; x += size) {


        for (let j = 0; j < size; j++) {
          for (let i = 0; i < size; i++) {
            let fillIndex = ((x + i) + (y + j) * video.width) * 4;
            if (results[fillIndex / 4] == 0) { // selfie

            } else { // background
              pg.fill(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
              pg.rect(x + i, y + j, 1, 1); // ピクセルごとに塗りつぶす
            }
          }
        }
      }
    }
  }

  adjustCanvas();
}

function draw() {
  // カメラ映像を表示
  image(video, 0, 0);

  // 背景を表示
  image(pg, 0, 0);
  // スタンプとして貼り付けた画像を表示
  for (let stamp of stamps) {
    image(stamp.image, stamp.x, stamp.y, stamp.width, stamp.height);
  }
}




// スナップショットをダウンロードする関数
function downloadSnapshot() {
  saveCanvas('stumpstudio', 'png');
}

function windowResized() {
  adjustCanvas(); //canvasのサイズを調整
}

function adjustCanvas() {
  var element_webcam = document.getElementById('webcam'); //webcamのidを取得
  resizeCanvas(element_webcam.clientWidth, element_webcam.clientHeight); //webcamのサイズに合わせる
}

function mouseClicked() {
  // 選択した画像をスタンプとして貼り付ける
  if (selectedImage) {
    stamps.push({
      image: selectedImage,
      x: mouseX - selectedImage.width / 2,
      y: mouseY - selectedImage.height / 2,
      width: selectedImage.width,
      height: selectedImage.height,
    });
  }
}  