import ml5 from "ml5";
let p5;
let delegate;

let notes = [];

for (let rowIdx = 0; rowIdx < 10; rowIdx++) {
  for (let colIdx = 0; colIdx < 5; colIdx++) {
    notes.push([128 * rowIdx, 148 * colIdx, 128, 148, { rowIdx, colIdx }]);
  }
}

let userId = 1;
function changeUser() {
  userId === 1 ? (userId = 2) : (userId = 1);
  updateMessage({ userId });
  setTimeout(changeUser, 20000);
}

export function main(_p5) {
  p5 = _p5;

  let video;
  let poseNet;
  let poses = [];

  p5.setup = () => {
    p5.createCanvas(1280, 720);
    const constraints = {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720
        },
        optional: [{ maxFrameRate: 60 }]
      },
      audio: false
    };

    video = p5.createCapture(constraints);
    video.size(1280, 720);

    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on("pose", function(results) {
      poses = results;
    });
    video.hide();
  };

  p5.draw = () => {
    p5.image(video, 0, 0, 1280, 720);
    drawNotes();
    drawKeypoints();
    drawSkeleton();
    drawTargetUser();
  };

  function modelReady() {
    p5.select("#status").html("Model Loaded");
    changeUser();
  }

  function drawNotes() {
    notes.forEach((el, idx) => {
      p5.stroke(0, 0, 0);
      p5.textSize(18);
      p5.fill(255, 255, 255);
      p5.text(idx, el[0], el[1]);
      p5.noFill();
      p5.rect(el[0], el[1], el[2], el[3]);
    });
  }

  function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        if (keypoint.score > 0.5) {
          p5.fill(255, 0, 0);
          p5.noStroke();
          p5.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);

          if (keypoint.part === "leftWrist") {
            checkPosition(keypoint.position.x, keypoint.position.y, [
              10,
              200,
              42,
              50
            ]);
          }

          if (keypoint.part === "rightWrist") {
            checkPosition(keypoint.position.x, keypoint.position.y, [
              255,
              0,
              255,
              50
            ]);
          }
        }
      }
    }
  }

  function drawSkeleton() {
    for (let i = 0; i < poses.length; i++) {
      let skeleton = poses[i].skeleton;
      for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        p5.stroke(255, 0, 0);
        p5.line(
          partA.position.x,
          partA.position.y,
          partB.position.x,
          partB.position.y
        );
      }
    }
  }

  function checkPosition(x, y, color) {
    const boxWidth = 128;
    const boxHeight = 148;
    notes.forEach((el, idx) => {
      const bx = el[0];
      const by = el[1];
      const bidx = el[4];
      if (
        x > bx - boxWidth &&
        x < bx + boxWidth &&
        y > by - boxHeight &&
        y < by + boxHeight
      ) {
        p5.fill(...color);
        p5.rect(
          boxWidth * bidx.rowIdx,
          boxHeight * bidx.colIdx,
          boxWidth,
          boxHeight
        );
        updateMessage({ position: idx });
      }
    });
  }

  function drawTargetUser() {
    if (userId === 1) {
      p5.fill(30, 144, 255, 80);
      p5.rect(0, 0, 640, 720);
    } else {
      p5.fill(30, 144, 255, 80);
      p5.rect(640, 0, 640, 720);
    }
  }
}

export function setDelegate(_delegate) {
  delegate = _delegate;
}

function updateMessage(message) {
  if (delegate !== undefined) {
    delegate(message);
  }
}
