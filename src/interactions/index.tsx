import React from "react";
import { makeGeometricRelative } from "./draggable";
import { INTERACTIONS_CONTAINER_BASE_WIDTH } from "../shared/constants";
import { Interaction } from "./components/Interactions";
import { InteractionsContainer } from "./components/InteractionsContainer";
import { VideoPlayer } from "./components/VideoPlayer";
import {
  Media,
  Video,
  Image,
  VideoType,
  ImageType,
  MediaResult,
  InteractionItemResult,
} from "./types.d/types";
import CloseButton from "../createLive/CloseButton/CloseButton";
import { useEffect, useState } from "react";
import Trash from "../icons/trash";

interface Props {
  medias: Media[];
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  setInteractionStep: React.Dispatch<React.SetStateAction<boolean>>;
  coverIndex: number;
  setCoverIndex: React.Dispatch<React.SetStateAction<number>>;
  onFinish: (medias: MediaResult[]) => void;
  uploadFile?: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<string>;
}

const ShortCreateInteractionsStep: React.FC<Props> = ({
  medias,
  setMedias,
  setInteractionStep,
  coverIndex,
  setCoverIndex,
  onFinish,
  uploadFile,
}: Props) => {
  const [activeInteraction, setActiveInteraction] = useState(-1);
  const hasAnyActiveInteraction = activeInteraction !== -1;
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayInput, setOverlayInput] = useState("");
  const [interaction, setInteraction] = useState<any>(null);
  const [activeMedia, setActiveMedia] = useState(
    medias.length > 0 ? medias.length - 1 : 0
  );
  const [uploadProgressValue, setUploadProgressValue] = useState<number>(0);

  // Initialize upload progress for the latest media item
  useEffect(() => {
    console.log("KOS", medias.length, uploadFile);
    if (uploadFile && medias.length > 0) {
      const latestMedia = medias[medias.length - 1];
      const onProgress = (progress: number) => {
        console.log("KOOOOOOOOOOOOOOOON", progress, 100 - progress);
        // Convert percentage (0-100) to decimal (0-1) for calculations
        setUploadProgressValue(progress / 100);
      };

      // Start upload for the latest media
      uploadFile(latestMedia.data.file, onProgress)
        .then((uploadedUrl) => {
          console.log("Upload completed:", uploadedUrl);
          // You can store the uploaded URL if needed
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
    }
  }, [medias.length, uploadFile, medias]);

  useEffect(() => {
    console.log("KIR", medias[activeMedia]);
  }, [medias, activeMedia]);

  useEffect(() => {
    console.log("Updated interactions", medias);
  }, [medias]);
  const onAddInteraction = (interaction: Interaction) => {
    setOverlayInput("");
    setShowOverlay(true);
    setInteraction(interaction);
  };

  const onDeleteActiveInteraction = () => {
    setMedias((prevMedias) => {
      return prevMedias.map((media, index) => {
        if (index === activeMedia) {
          return {
            ...media,
            interactions: media.interactions.filter(
              (_, i) => i !== activeInteraction
            ),
          };
        }
        return media;
      });
    });
    setActiveInteraction(-1);
  };

  const onSaveActiveInteraction = () => {
    const { interaction, payload } =
      medias[activeMedia].interactions[activeInteraction];
    const errorMessages = (interaction as any).validate({ payload });

    for (const errors of Object.values(errorMessages) as string[][]) {
      for (const error of errors) {
        if (typeof error !== "string" || error.length <= 0) continue;
        console.log("ERROR", error);
        return;
      }
    }

    setActiveInteraction(-1);
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(38, 38, 38, 1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
              borderRadius: "15px",
            }}
            onClick={() => {
              setMedias((prev) => {
                const updated = prev.filter((_, i) => i !== activeMedia);
                if (updated.length === 0) {
                  setInteractionStep(false);
                } else {
                  console.log("INO", activeMedia);
                  if (activeMedia > 0) {
                    setActiveMedia(activeMedia - 1);
                  } else {
                    setActiveMedia(0);
                  }
                }
                return updated;
              });
            }}
          >
            <Trash />
          </div>
          {hasAnyActiveInteraction ? (
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <button
                color="white"
                style={{ background: "none", border: "none", opacity: 50 }}
                onClick={onDeleteActiveInteraction}
              >
                <Trash />
              </button>
              <button
                style={{
                  background: "rgba(56, 78, 216, 1)",
                  color: "white",
                  width: "60px",
                  height: "30px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                  marginRight: "25px",
                  marginLeft: "auto",
                }}
                onClick={onSaveActiveInteraction}
              >
                تایید
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                position: "relative",
              }}
            >
              <div>
                {medias[activeMedia] && medias[activeMedia].interactions && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "transparent",
                        borderRadius: "15px",
                      }}
                    >
                      <InteractionsContainer
                        activeInteraction={activeInteraction}
                        setActiveInteraction={setActiveInteraction}
                        medias={medias}
                        setMedias={setMedias}
                        activeMedia={activeMedia}
                        style={{ width: INTERACTIONS_CONTAINER_BASE_WIDTH }}
                        onAddInteraction={onAddInteraction}
                        onDelete={onDeleteActiveInteraction}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <VideoPlayer
            medias={medias}
            setMedias={setMedias}
            activeMedia={activeMedia}
            activeInteraction={activeInteraction}
            setActiveInteraction={setActiveInteraction}
            media={medias[activeMedia]}
          />
          <div
            style={{
              position: "absolute",
              bottom: "25px",
              display: "flex",
              width: "100%",
              height: "40px",
              alignItems: "center",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                paddingLeft: "16px",
                paddingRight: "16px",
                alignItems: "center",
              }}
            >
              <div>
                <button
                  style={{
                    background: "rgba(224, 224, 226, 1)",
                    padding: "5px 15px",
                    border: "none",
                    borderRadius: "15px",
                  }}
                  onClick={() => {
                    setCoverIndex(activeMedia);
                  }}
                >
                  {coverIndex === activeMedia ? (
                    <div>عکس کاور</div>
                  ) : (
                    <div>انتخاب به عنوان عکس کاور</div>
                  )}
                </button>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                }}
              >
                <div>
                  <button
                    onClick={() => {
                      onFinish(
                        medias.map((media): MediaResult => {
                          return {
                            ...media,
                            interactions: media.interactions.map(
                              (interactionItem): InteractionItemResult => {
                                return {
                                  payload: interactionItem.payload,
                                  geometric: interactionItem.geometric,
                                  interaction: interactionItem.interaction.type,
                                };
                              }
                            ),
                          };
                        })
                      );
                    }}
                    style={{
                      background: "rgba(37, 79, 195, 1)",
                      color: "white",
                      border: "none",
                      width: "100px",
                      height: "40px",
                      borderRadius: "5px",
                    }}
                  >
                    ادامه
                  </button>
                </div>
                <div style={{ color: "white", display: "flex" }}>
                  <div
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "5px",
                    }}
                  >
                    {medias.filter((m) => m.fileType === ImageType).length}/10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            flexShrink: 0,
            height: "90px",
            background: "black",
            paddingBottom: "13px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <button
              onClick={() => setInteractionStep(false)}
              style={{
                width: "100px",
                height: "53px",
                background: "none",
                color: "white",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 4.5H11V11.5H4V13.5H11V20.5H13V13.5H20V11.5H13V4.5Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div style={{ fontSize: "10px" }}>افزودن</div>
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "3px",
              overflow: "auto",
              marginRight: "30px",
            }}
          >
            {medias.map((media, idx) => {
              // Only apply progress animation to the last media item (the one being uploaded)
              const isLastItem = idx === medias.length - 1;
              const showProgress = uploadFile && isLastItem;

              if (medias && medias[idx] && media.fileType === VideoType) {
                const video = media.data as Video;
                return (
                  <div
                    style={{
                      position: "relative",
                      width: "fit-content",
                      height: "fit-content",
                      margin: "4px",
                    }}
                    key={idx}
                  >
                    {video.thumbnail ? (
                      <div style={{ position: "relative" }}>
                        <img
                          src={video.thumbnail}
                          alt="video thumbnail"
                          style={{
                            width: "42px",
                            height: "42px",
                            // objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onClick={() => {
                            setActiveMedia(idx);
                            setActiveInteraction(-1);
                          }}
                        />
                        {showProgress && (
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              top: 0,
                              height: `${(1 - uploadProgressValue) * 100}%`,
                              background: "rgba(0, 0, 0, 0.6)",
                              borderRadius: "0 0 4px 4px",
                              transition: "height 0.3s ease",
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          background: "#ccc",
                          borderRadius: "4px",
                          position: "relative",
                        }}
                        onClick={() => {
                          setActiveMedia(idx);
                          setActiveInteraction(-1);
                        }}
                      >
                        {showProgress && (
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              bottom: 0,
                              height: `${(1 - uploadProgressValue) * 100}%`,
                              background: "rgba(0, 0, 0, 0.6)",
                              borderRadius: "0 0 4px 4px",
                              transition: "height 0.3s ease",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              const image = media.data as Image;
              return (
                <div
                  style={{
                    position: "relative",
                    width: "fit-content",
                    height: "fit-content",
                    margin: "4px",
                    borderRadius: "4px",
                  }}
                  key={idx}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      onClick={() => {
                        setActiveMedia(idx);
                        setActiveInteraction(-1);
                      }}
                      src={image.src}
                      alt="image"
                      style={{
                        width: "42px",
                        height: "42px",
                        objectFit: "cover",
                        boxSizing: "border-box",
                        border:
                          idx === activeMedia ? "4px solid green" : "none",
                        borderRadius: idx === activeMedia ? "none" : "4px",
                        display: "block",
                      }}
                    />
                    {showProgress && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: `${(1 - uploadProgressValue) * 100}%`,
                          background: "rgba(0, 0, 0, 0.6)",
                          borderRadius: "0 0 4px 4px",
                          transition: "height 0.3s ease",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {showOverlay && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 999,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                position: "absolute",
                width: "60px",
                height: "30px",
                top: "20px",
                right: "20px",
                background: "rgba(56, 78, 216, 1)",
                color: "white",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => {
                setMedias((prevMedias) => {
                  return prevMedias.map((media, index) => {
                    if (index === activeMedia) {
                      const newInteraction = {
                        interaction,
                        payload: JSON.parse(
                          JSON.stringify({
                            ...interaction.defaultPayload,
                            text: overlayInput,
                          })
                        ),
                        geometric: makeGeometricRelative({
                          x: 50,
                          y: 50,
                          width: 100,
                          height: 100,
                        }),
                      };

                      console.log(newInteraction);

                      return {
                        ...media,
                        interactions: [...media.interactions, newInteraction],
                      };
                    }
                    return media;
                  });
                });

                setShowOverlay(false);
                setOverlayInput("");
              }}
            >
              تایید
            </button>

            <textarea
              value={overlayInput}
              onChange={(e) => setOverlayInput(e.target.value)}
              placeholder="متن"
              style={{
                background: "transparent",
                outline: "none",
                caretColor: "rgba(56, 78, 216, 1)",
                fontSize: "28px",
                border: "none",
                color: "white",
                padding: "10px 15px",
                borderRadius: "5px",
                width: "60%",
                textAlign: "center",
                direction: "rtl",
                resize: "none",
                overflow: "hidden",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            />
          </div>
        )}
      </div>
      <div
        style={{
          background: "black",
          height: "52px",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{
            width: "100%",
            height: "48px",
            background: "rgba(68, 68, 68, 1)",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            border: "none",
            borderRadius: "9px",
          }}
        >
          ادامه
        </button>
      </div>
    </div>
  );
};

export { ShortCreateInteractionsStep };
export default ShortCreateInteractionsStep;
