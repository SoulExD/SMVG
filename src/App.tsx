import React, { useState } from "react";
import "./App.css";

function App() {
  const [filebase64, setFileBase64] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State variable to track loading
  const [dataLoaded, setDataLoaded] = useState<boolean>(false); // State variable to track if data is loaded
  var notesRecognized: any[] = [];
  var textRecognized: any[] = [];
  const [notes, setNotes] = useState<string>("");
  const [text, setText] = useState<string>("");

  function arreyToString(arr: any[]): string {
    // Join array elements into a string with a comma-separated format
    const noteArray = arr.slice(1);
    const filteredArr = noteArray.filter((item) => !item.includes("barline"));
    return filteredArr.join(" | ");
  }

  function dataURItoBlob(dataURI: string): Blob {
    // Split the base64 data URI into two parts: metadata and data
    const splitDataURI = dataURI.split(",");
    // Extract the data part (base64 string)
    const base64String = splitDataURI[1];
    // Convert the base64 string to a byte array
    const byteCharacters = atob(base64String);
    // Convert the byte array to a typed array
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    // Create a Blob object from the typed array
    const blob = new Blob([byteArray], { type: "image/png" });
    return blob;
  }

  function arrayToString(arr: any[]): string {
    // Join array elements into a string with a comma-separated format
    const noteArray = arr.filter(item => item.includes("note"));
    const filteredArr = noteArray.filter((item) => !item.includes("barline"));
    return filteredArr.join(" | ");
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted
    // Create a new FormData object
    const formData = new FormData();
    // Append the file data to the formData object
    const fileBlob = dataURItoBlob(filebase64);
    formData.append("file", fileBlob, "image.png");

    // Make a POST request to the Flask server
    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setLoading(false); // Set loading state to false when response is received
        if (response.ok) {
          // Handle successful response
          return response.json();
        } else {
          // Handle error response
          throw new Error("Upload failed");
        }
      })
      .then((data) => {
        // Handle data from the Flask server
        var result = data.result;
        notesRecognized = result[0];
        textRecognized = result[1];

        setNotes(arrayToString(notesRecognized));
        setText(arreyToString(textRecognized));
        console.log("Notes Recognized:", notes);
        console.log("Text Recognized:", text);

        setDataLoaded(true); // Set dataLoaded to true when data is loaded
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  }

  // The Magic all happens here.
  function convertFile(files: FileList | null) {
    if (files) {
      const fileRef = files[0] || "";
      const reader = new FileReader();
      reader.readAsDataURL(fileRef);
      reader.onload = (ev: any) => {
        // Set the filebase64 state with the base64 data
        setFileBase64(ev.target.result);
      };
    }
  }

  return (
    <>
      <div className="shadow-2xl px-6 py-8 rounded-2xl">
        <form onSubmit={formSubmit}>
          <div className="flex flex-col justify-center border-4 border-dashed rounded-2xl w-[24rem] max-w-[26rem] max-h-[36rem] z-10">
            {filebase64 ? (
              <img
                src={filebase64}
                alt="Uploaded"
                className="w-full rounded-2xl z-10"
              />
            ) : (
              <img
                src="../src/assets/ImgUpload.svg"
                alt="Placeholder"
                className="w-[10rem] py-[12rem] mx-auto z-10"
                id="placeHolder"
              />
            )}
          </div>
          <div className="flex flex-row gap-8 justify-center pt-6 z-10">
            <input
              className="hidden"
              type="file"
              id="img"
              onChange={(e) => convertFile(e.target.files)}
            />
            <label
              htmlFor="img"
              className="p-2 w-[11rem] border-2 rounded-xl font-lato font-bold text-white text-center z-10 hover:bg-[#2c508e]"
            >
              Upload Image
            </label>
            <button
              type="submit"
              className="p-2 w-[11rem] border-2 rounded-xl font-lato font-bold text-white text-center z-10 hover:bg-[#2c508e]"
            >
              Generate Notations
            </button>
          </div>
        </form>
      </div>
      <div className="px-10 flex flex-col jusitfy-items-center gap-10">
        <div className="flex justify-center">
          <img src="../src/assets/Logo.svg" alt="Logo" className="w-[16rem]" />
        </div>
        {loading && (
          <div className="spinner flex justify-center">
            <img
              src="../src/assets/Spinner.svg"
              alt="Spinner"
              className="w-[5rem] h-[5rem] "
            />
          </div>
        )}{" "}
        {/* Render the spinner if loading state is true */}
        {dataLoaded && (
          <div className="output w-[25rem]">
            <h2 className="text-white font-bold p-2">Notes Recognized:</h2>
            {notesRecognized && (
              <div className="text-white rounded-xl border-white border-2 p-4">
                {notes}
              </div>
            )}
            <h2 className="text-white font-bold p-2">Text Recognized:</h2>
            {textRecognized && (
              <div className="text-white rounded-xl border-white border-2 p-4">
                {text}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
