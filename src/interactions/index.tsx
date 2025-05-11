import classnames from "classnames";
import { makeGeometricRelative } from "./draggable";
import { INTERACTIONS_CONTAINER_BASE_WIDTH } from "../shared/constants";
import { Interaction } from "./components/Interactions";
import { InteractionsContainer } from "./components/InteractionsContainer";
import { VideoPlayer } from "./components/VideoPlayer";
import { Media, Video, Image, VideoType } from "./types.d/types";
import CloseButton from "../createLive/CloseButton/CloseButton";
import { useEffect, useState } from "react";
import Trash from "../icons/trash";

interface Props {
  medias: Media[];
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  setInteractionStep: React.Dispatch<React.SetStateAction<boolean>>;
  coverIndex: number;
  setCoverIndex: React.Dispatch<React.SetStateAction<number>>;
}

function ShortCreateInteractionsStep({
  medias,
  setMedias,
  setInteractionStep,
  coverIndex,
  setCoverIndex,
}: Props) {
  const [activeInteraction, setActiveInteraction] = useState(-1);
  const hasAnyActiveInteraction = activeInteraction !== -1;
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayInput, setOverlayInput] = useState("");
  const [interaction, setInteraction] = useState<any>(null);
  const [activeMedia, setActiveMedia] = useState(
    medias.length > 0 ? medias.length - 1 : 0,
  );

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
              (_, i) => i !== activeInteraction,
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
    <div
      className="w-full h-full d-flex flex-col"
      style={{ position: "relative" }}
    >
      {/* Header */}
      <div className="pos-absolute top-0 left-0 right-0 w-full px-3 pt-3 d-flex jc-between z-3">
        {hasAnyActiveInteraction ? (
          <>
            <button
              color="white"
              className="opacity-50"
              style={{ background: "none", border: "none" }}
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
              }}
              onClick={onSaveActiveInteraction}
            >
              تایید
            </button>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              position: "relative",
            }}
          >
            {/* Left - InteractionsContainer */}
            <div>
              <InteractionsContainer
                activeInteraction={activeInteraction}
                setActiveInteraction={setActiveInteraction}
                medias={medias}
                setMedias={setMedias}
                activeMedia={activeMedia}
                style={{ width: INTERACTIONS_CONTAINER_BASE_WIDTH }}
                onAddInteraction={onAddInteraction}
                className={classnames("z-10", {
                  "pos-absolute bottom-0": true,
                })}
                onDelete={onDeleteActiveInteraction}
              />
            </div>

            {/* Center - انتشار آگهی */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                position: "absolute",
                left: 0,
                right: 0,
                margin: "0 auto",
                pointerEvents: "none",
              }}
            >
              انتشار آگهی
            </div>

            {/* Right - CloseButton */}
            <div style={{ marginLeft: "auto" }}>
              <CloseButton />
            </div>
          </div>
        )}
      </div>

      {/* Video - fills remaining space */}
      <div className="flex-grow-1 position-relative" style={{ height: "100%" }}>
        <VideoPlayer
          wrapperClassName="w-full h-full"
          className="w-full h-full"
          medias={medias}
          setMedias={setMedias}
          activeMedia={activeMedia}
          activeInteraction={activeInteraction}
          setActiveInteraction={setActiveInteraction}
          media={medias[activeMedia]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "110px",
          display: "flex",
          width: "100%",
          height: "40px",
          alignItems: "center",
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
          <div style={{ marginLeft: "auto" }}>
            <button
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
        </div>
      </div>
      <div
        className="w-full py-2"
        style={{
          flexShrink: 0,
          height: "92px",
          background: "black",
          padding: "13px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left - افزودن عکس */}
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

        {/* Right - items */}
        <div style={{ display: "flex", gap: "3px", overflow: "auto" }}>
          {medias.map((media, idx) => {
            if (media.fileType === VideoType) {
              const video = media.data as Video;
              return (
                <div key={idx}>
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt="video thumbnail"
                      style={{
                        width: "42px",
                        height: "42px",
                        // objectFit: "cover",
                        borderRadius: "4px",
                      }}
                      onClick={() => setActiveMedia(idx)}
                    />
                  ) : (
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        background: "#ccc",
                        borderRadius: "4px",
                      }}
                      onClick={() => setActiveMedia(idx)}
                    ></div>
                  )}
                </div>
              );
            }
            const image = media.data as Image;
            return (
              <div key={idx}>
                <img
                  onClick={() => setActiveMedia(idx)}
                  src={image.src}
                  alt="image"
                  style={{
                    width: "42px",
                    height: "42px",
                    // objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      {showOverlay && (
        <div
          className="pos-absolute top-0 left-0 w-full h-full d-flex flex-col"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 999,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Submit button */}
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
                        }),
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

              // Update activeInteraction to the new interaction's index
              const active = medias[activeMedia].interactions.length;
              setActiveInteraction(active);

              setShowOverlay(false);
              setOverlayInput("");
            }}
          >
            تایید
          </button>

          {/* Centered text input */}
          <textarea
            // type="text"
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
  );
}

export { ShortCreateInteractionsStep };
export default ShortCreateInteractionsStep;
