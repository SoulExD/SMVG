import React,{ useState }  from 'react';
import './App.css';

function App() {
  const [filebase64,setFileBase64] = useState<string>("")


  function formSubmit(e: any) {
    e.preventDefault();
    // Submit your form with the filebase64 as 
    // one of your fields
    console.log({filebase64})
    alert("here you'd submit the form using\n the filebase64 like any other field")
  }

  // The Magic all happens here.
  function convertFile(files: FileList|null) {
    if (files) {
      const fileRef = files[0] || ""
      const fileType: string= fileRef.type || ""
      console.log("This file upload is of type:",fileType)
      const reader = new FileReader()
      reader.readAsBinaryString(fileRef)
      reader.onload=(ev: any) => {
        // convert it to base64
        setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`)
      }
    }
  }


  return (
  <>
    <div className='shadow-2xl px-6 py-8 rounded-2xl'>
        <form onSubmit={formSubmit}>
          <div className='flex flex-col justify-center border-4 border-dashed rounded-2xl w-[24rem] max-w-[26rem] max-h-[36rem] z-10'>
          { filebase64 ? (
            <>
            {filebase64.indexOf("image/") > -1 && (
            <img src={filebase64} className='w-full rounded-2xl z-10'/>
            )}
            </>
            ) : (
              <img src="../src/assets/ImgUpload.svg" className='w-[10rem] py-[12rem] mx-auto z-10' id="placeHolder"></img>
            )}
          </div>
          <div className='flex flex-row gap-8 justify-center pt-6 z-10'>
            <input className='hidden' type="file" id='img' onChange={(e)=> convertFile(e.target.files)} />
            <label htmlFor="img" className='p-2 w-[8rem] border-2 rounded-xl font-lato font-bold text-white text-center z-10'>Upload Image</label>
          </div>
        </form>
    </div>
    <div className='px-10 flex flex-col jusitfy-items-center gap-10'>
      <div className='flex justify-center'>
      <img src="../src/assets/Logo.svg" className='w-[16rem]'></img>
      </div>
      <button type='submit' className='p-2 w-[24rem] border-2 rounded-xl font-lato font-bold text-white text-center z-10'>Generate Voice for Sheet Music</button>
      <button className='p-2 w-[24rem] border-2 rounded-xl font-lato font-bold text-white text-center z-10'>Download Generated Music</button>
    </div>
    </>
  );
}

export default App;