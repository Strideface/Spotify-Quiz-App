import AsyncSelect from "react-select/async";
import { useRef, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

import {
  fetchArtistTopTracks,
  fetchSearchedItems,
} from "../../../../util/spotify-api";
import { shuffleArray } from "../../../../util/util";

export default function AnswerSelection({
  activeTrackIndex,
  setUserResponse,
  artistIsCorrect,
  trackIsCorrect,
  setTimerIsFinished,
}) {
  const { quizData } = useOutletContext();
  const [selectedValue, setSelectedValue] = useState({
    artist: null,
    track: null,
  });

  const lastChange = useRef();
  const artistSearchBar = useRef();
  const trackSelector = useRef();
  const error = useRef();

  // https://www.dhiwise.com/post/how-to-implement-a-react-search-bar-with-dropdown
  // https://react-select.com/home

  // function must return a promise
  // artist search bar
  const searchloadOptions = (inputValue) => {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    if (inputValue.trim().length !== 0) {
      let options = [];
      return new Promise((resolve) => {
        lastChange.current = setTimeout(() => {
          lastChange.current = null;

          resolve(
            fetchSearchedItems(
              inputValue,
              quizData.current.userDetails.country,
              "artist",
              10
            )
              .then((searchItemsData) => {
                error.current = null;
                searchItemsData.map((item) =>
                  options.push({
                    label: item.name,
                    value: item.name,
                    id: item.id,
                  })
                );
                // return an array of artist options for the user to select following a search
                return options;
              })
              .catch((err) => {
                error.current = err;
                return options;
              })
          );
        }, 2000);
      });
    }
  };

  // handles the changing of a selection from the artist search
  const handleSearchOnChange = (value, actionType) => {
    if (actionType.action === "select-option") {
      setSelectedValue((prevState) => ({
        artist: value,
        track: null,
      }));
    } else if (actionType.action === "clear") {
      setSelectedValue((prevState) => ({
        artist: null,
        track: null,
      }));
    }
  };

  // track selector
  const trackSelectorLoadOptions = () => {
    let options = [];

    return new Promise((resolve) => {
      resolve(
        fetchArtistTopTracks(
          selectedValue.artist.id,
          quizData.current.userDetails.country
        )
          .then((artistTrackItemsData) => {
            error.current = null;
            artistTrackItemsData.map((item) =>
              options.push({
                label: item.name,
                value: item.name,
                id: item.id,
              })
            );
            // if the artist selected in the artist search bar matches the artist in the currently playing track
            if (
              quizData.current.quizTracks[activeTrackIndex.current].artist[0]
                .id === selectedValue.artist.id
            ) {
              // then, if the currently playing track by that artist is not in the list of top tracks being returned, add it.
              // so that the user has the possibility of selecting the right answer (top tracks won't neccessarily contain the track currently playing)
              let idMatch = options.filter(
                (track) =>
                  track.id ===
                  quizData.current.quizTracks[activeTrackIndex.current].track.id
              );
              if (idMatch.length === 0) {
                options.push({
                  label:
                    quizData.current.quizTracks[activeTrackIndex.current].track
                      .name,
                  value:
                    quizData.current.quizTracks[activeTrackIndex.current].track
                      .name,
                  id: quizData.current.quizTracks[activeTrackIndex.current]
                    .track.id,
                });
              }
            }
            // always return the list of options in random order, oherwise the added correct option will always be in the same position.
            shuffleArray(options);
            return options;
          })
          .catch((err) => {
            error.current = err;
            return options;
          })
      );
    });
  };

  // handles the changing of a selection from the track selector
  const handleTrackSelectorOnChange = (value, actionType) => {
    if (actionType.action === "select-option") {
      setSelectedValue((prevState) => ({
        ...prevState,
        track: value,
      }));
    } else if (actionType.action === "clear") {
      setSelectedValue((prevState) => ({
        ...prevState,
        track: null,
      }));
    }
  };

  const handleSubmitAnswer = () => {
    console.log(selectedValue)
    if (
      selectedValue.artist.id ===
      quizData.current.quizTracks[activeTrackIndex.current].artist[0].id
    ) {
      artistIsCorrect.current = true;
      quizData.current.quizResults.totalPoints += 1;
      quizData.current.quizResults.totalCorrectArtists += 1;
    } else {
      artistIsCorrect.current = false;
    }

    if (
      selectedValue.track.id ===
      quizData.current.quizTracks[activeTrackIndex.current].track.id
    ) {
      trackIsCorrect.current = true;
      quizData.current.quizResults.totalPoints += 1;
      quizData.current.quizResults.totalCorrectTracks += 1;
    } else {
      trackIsCorrect.current = false;
    }
    setTimerIsFinished(true);

    setUserResponse((prevState) => {
      return [...prevState, selectedValue];
    });
  };

  const handleSkip = useCallback(() => {
    quizData.current.quizResults.totalSkipped += 1;
    artistIsCorrect.current = false;
    trackIsCorrect.current = false;

    setTimerIsFinished(true);

    setUserResponse((prevState) => {
      return [...prevState, "SKIPPED"];
    });
  }, [artistIsCorrect, quizData, setTimerIsFinished, setUserResponse, trackIsCorrect]);

  return (
    <>
      <AsyncSelect
        ref={artistSearchBar}
        isSearchable={!selectedValue.artist}
        cacheOptions
        isClearable
        placeholder="search..."
        noOptionsMessage={() => "search for options"}
        loadOptions={searchloadOptions}
        onChange={(value, action) => handleSearchOnChange(value, action)}
      />
      {error.current && <p>{error.current.message}</p>}

      {selectedValue.artist && (
        <AsyncSelect
          ref={trackSelector}
          isSearchable={false}
          cacheOptions
          isClearable
          placeholder="select..."
          defaultOptions
          loadOptions={trackSelectorLoadOptions}
          onChange={(value, action) =>
            handleTrackSelectorOnChange(value, action)
          }
        />
      )}

      {selectedValue.track ? (
        <button onClick={handleSubmitAnswer}>Submit Answer</button>
      ) : (
        <button onClick={handleSkip}>Skip</button>
      )}
    </>
  );
}
