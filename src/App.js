import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

// const videoConstraintsForFrontCam = {
//   width: 400,
//   height: 250,
//   facingMode: "user",
// };

// const videoConstraintsForBackCam = {
//   width: 400,
//   height: 250,
//   facingMode: { exact: "environment" },
// };

function App() {
  const classes = useStyle();
  // For taking snaps
  // const WebcamComponent = () => <Webcam />;
  const webcamRef = React.useRef(null);
  const downloadLinkRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [selectedCam, setSelectedCam] = useState(true);

  const videoConstraints = {};
  if (selectedCam) {
    const videoConstraints = {
      width: 400,
      height: 250,
      facingMode: "user",
    };
  } else {
    const videoConstraints = {
      width: 400,
      height: 250,
      facingMode: { exact: "environment" },
    };
  }

  const handleChangeToBackCam = () => {
    setSelectedCam(false);
    console.log(`Changed to back Cam with value ${videoConstraints}`);
  };

  const handleChangeToFrontCam = () => {
    setSelectedCam(true);
    console.log(`Changed to Front Cam with value ${videoConstraints}`);
  };

  // const videoConstraints = {
  //   width: 400,
  //   height: 250,
  //   facingMode: "user",
  // };

  // if (selectedCam) {
  //    videoConstraints = {
  //     width: 400,
  //     height: 250,
  //     facingMode: "user",
  //   };
  // } else {
  //    videoConstraints = {
  //     width: 400,
  //     height: 250,
  //     facingMode: { exact: "environment" },
  //   };
  // }

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const download = () => {
    downloadLinkRef.current.click();
  };
  const discardSnap = () => {
    setImgSrc(null);
  };

  // For video recording...
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [blobData, setBlobData] = useState("");
  const [videoShowFlag, setvideoShowFlag] = useState(false);

  const handleStartCaptureClick = React.useCallback(() => {
    setRecordedChunks([]);
    setBlobData("");
    setvideoShowFlag(false);

    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
      //mimeType: "video/mp4",
      //initCallback: null,
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);
      //console.log(url);
      //setBlobData(url);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "SampleVideoRecord.webm";
      a.click();
      //setBlobData(url);
      //window.URL.revokeObjectURL(url);
      //setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const handleDiscardDownload = () => {
    setRecordedChunks([]);
    setBlobData("");
    setvideoShowFlag(false);
  };

  const handleVideoShow = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);
      console.log(url);
      setBlobData(url);
    }
    setvideoShowFlag(true);
  };

  return (
    <>
      <Container className={classes.container}>
        <Typography variant="h3" align="center">
          Capture Snap and record video using webcam
        </Typography>
      </Container>
      <Container style={{ marginTop: "20px" }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={12} justify="center">
            <div className={classes.webcam}>
              <Webcam
                audio={true}
                height={250}
                ref={webcamRef}
                screenshotFormat="png"
                width={400}
                videoConstraints={videoConstraints}
              />
              <br />
              <div>
                {selectedCam ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleChangeToBackCam}
                  >
                    Change To Back Cam
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleChangeToFrontCam}
                  >
                    Change To Front Cam
                  </Button>
                )}
              </div>
              <br />
              <div>
                {capturing ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStopCaptureClick}
                  >
                    Stop Recording
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartCaptureClick}
                  >
                    Start Recording
                  </Button>
                )}
                {recordedChunks.length > 0 && (
                  <React.Fragment>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: "3px" }}
                      onClick={(e) => {
                        handleVideoShow();
                      }}
                    >
                      Show Recording
                    </Button>
                  </React.Fragment>
                )}
              </div>
              <br />
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    capture();
                  }}
                >
                  Take Snap
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item sm={12} md={4} style={{ marginLeft: "5%" }}>
            <div>
              {imgSrc ? <img src={imgSrc} /> : null}
              <a ref={downloadLinkRef} href={imgSrc} download></a>
              <div>
                {imgSrc ? (
                  <React.Fragment>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={(e) => {
                          download();
                        }}
                      >
                        {" "}
                        Download
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: "3px" }}
                        startIcon={<DeleteIcon />}
                        onClick={(e) => {
                          discardSnap();
                        }}
                      >
                        {" "}
                        Discard Snap
                      </Button>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </Grid>
          <Grid item sm={12} md={4} style={{ marginLeft: "20%" }}>
            {videoShowFlag ? (
              <React.Fragment>
                <video width="400" src={blobData} type="video/webm" controls>
                  console.log('blobData') Your browser does not support HTML5
                  video.
                </video>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "3px" }}
                    startIcon={<DeleteIcon />}
                    onClick={(e) => {
                      handleDiscardDownload();
                    }}
                  >
                    Discard
                  </Button>
                </div>
              </React.Fragment>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

const useStyle = makeStyles((theme) => ({
  container: {
    marginTop: "20px",
    backgroundColor: theme.palette.info.light,
  },
  webcam: {
    justifyContent: "center",
    justify: "center",
    marginLeft: "35%",
  },
}));

export default App;
