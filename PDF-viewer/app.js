const url = 'You_Dont_Know_JS_Up_and_Going.pdf';

//Createing variables with let that are going to be reassigned later
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
      canvas = document.querySelector('#pdf-render'),
      context = canvas.getContext('2d');

//Render the page
const renderPage = num =>{
  //leting the program know that the page is rendering
  pageIsRendering = true;

  // geting the page useing the getPage method provided by the library
  pdfDoc.getPage(num).then(page => {
    //seting the scale using the getViewport method provided by the library witch takes a object as a parametar
    const viewport = page.getViewport({ scale });
    //seting the canvas height and width
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    //defineing the object that will be used later
    const renderContext = {
      canvasContext: context,
      viewport
    }

    page.render(renderContext).promise.then(()=> {
      //seting the pageisRendering to false becouse it is renderd
      pageIsRendering = false;

      if (pageNumIsPending !== null){
        //rendering the page if pageNumIsPending is null
        renderPage(pageNumIsPending);
        //Returning it to null after the render
        pageNumIsPending = null;
      };
    });

    //Output curent page
    document.querySelector("#page-num").textContent = num;
  });
};

// Check for pages rendering that will be used in the next prev/next page functions
const queueRenderPage = num =>{
  if(pageIsRendering){
    pageNumIsPending = num;
  }else {
    renderPage(num);
  }
};

//Show prev page
const showPrevPage = () => {
  if(pageNum <= 1){
    return
  }
  pageNum--;
  queueRenderPage(pageNum);
}
//Show next page
const showNextPage = () => {
  if(pageNum >= pdfDoc.numPages){
    return
  }
  pageNum++;
  queueRenderPage(pageNum);
}


//Get Document useing the pdfjslib object provided by the cdn
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
   // seting the pdfDoc that was declared to  null to the pdfDoc_ that was returned from the method
   pdfDoc = pdfDoc_;
   
   //filling the spans in the htlm to show the total number of Pages

   //seting the text content to the numPages method provided with the pdfLib
   document.querySelector('#page-count').textContent = pdfDoc.numPages;
   
   renderPage(pageNum);
})
  .catch(err => {
    //Createing the error div
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    document.querySelector('.top-bar').style.display = 'none'
  });

//Button events
document.querySelector('#prev-page').addEventListener('click', showPrevPage)
document.querySelector('#next-page').addEventListener('click', showNextPage)