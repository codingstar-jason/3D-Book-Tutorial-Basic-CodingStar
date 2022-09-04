

document.addEventListener('DOMContentLoaded', function() {
        
    
    // Get the modal
    var modal = document.getElementById("myModal");

    //Get the image and insert it inside the modal - use its "alt" text as a caption
    var imgs = document.getElementById("myImg01");
    var img2 = document.getElementById("myImg02");
    var img3 = document.getElementById("myImg03");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("mod-caption");


    var manager1 = new Hammer.Manager(imgs);
    var manager2 = new Hammer.Manager(img2);
    var manager3 = new Hammer.Manager(img3);

    //var modalManager = new Hammer.Manager(modalImg);
    
    //tap for desktop testing
    var Tap = new Hammer.Tap({
        taps: 1
      });
      
    // var Tap2 = new Hammer.Tap({
    // taps: 2
    // });

    manager1.add(Tap); 
    manager2.add(Tap); 
    manager3.add(Tap); 
    // modalManager.add(Tap2)

    manager1.on('tap', openModal);

    manager2.on('tap', openModal);

    manager3.on('tap', openModal);

    // modalManager.on('tap', function(){
    //     modal.style.display = "none";
    // });

    

    // //   testing pinch
    // //hammertime.get('pinch').set({ enable: true });
    //     var Pinch = new Hammer.Pinch();
    //     manager1.add(Pinch); 
    //     manager2.add(Pinch); 
    //     manager3.add(Pinch); 
    //     modalManager.add(Pinch);

        

    //     manager1.on('pinch', function(e){
    //         modal.style.display = "block";
    //         modalImg.src = e.target.src;
    //         captionText.innerHTML = e.target.alt;
    //     });
    //     manager2.on('pinch', function(e){
    //         modal.style.display = "block";
    //         modalImg.src = e.target.src;
    //         captionText.innerHTML = e.target.alt;
    //     }); 
    //     manager3.on('pinch', function(e){
    //         modal.style.display = "block";
    //         modalImg.src = e.target.src;
    //         captionText.innerHTML = e.target.alt;
    //     });

    //     modalManager.on('pinch', function(){
    //         modal.style.display = "none";
    //     });



    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
      imgWidth = null;
    imgHeight = null;
         viewportWidth = null;
         viewportHeight = null;
         scale = 1;
         lastScale = null;
         container = null;
        // var img = null;
         x = 0;
     lastX = 0;
         y = 0;
         lastY = 0;
         pinchCenter = null; 
    }

    function openModal(e){
        modal.style.display = "block";
        modalImg.src = e.target.src;
        captionText.innerHTML = e.target.alt;
    }
// -----------------------------------------------------------------------------------------------------------------------------------------
// window.onload = () => {
//     // (A) GET ALL IMAGES
//     let all = document.getElementsByTagName("img");
//     console.log(all);

//     // (B) CLICK TO GO FULLSCREEN
    
//     if (all.length>0) { 
//         for (let i of all) {
//             var manager = new Hammer.Manager(i);

//             //tap for desktop testing
//             var Pinch = new Hammer.Pinch();
            

//             manager.add(Pinch); 
//         manager.on("pinch", (e) => {
//             // (B1) EXIT FULLSCREEN
//             console.log(e.target.src);
//             console.log(e.target);
//             if (document.fullscreenElement != null || document.webkitFullscreenElement != null) {
//                 if (document.exitFullscreen) { 
//                     document.exitFullscreen(); 
//                 }
//                 else { 
//                     document.webkitCancelFullScreen(); }
//                 }

//             // (B2) ENTER FULLSCREEN
//             else {
//             if (e.target.requestFullscreen) 
//             { e.target.requestFullscreen(); }
//             else { e.target.webkitRequestFullScreen(); }
//             }
//       });
//     }}
//   };


var MIN_SCALE = 1; // 1=scaling when first loaded
var MAX_SCALE = 8;

// HammerJS fires "pinch" and "pan" events that are cumulative in nature and not
// deltas. Therefore, we need to store the "last" values of scale, x and y so that we can
// adjust the UI accordingly. It isn't until the "pinchend" and "panend" events are received
// that we can set the "last" values.

// Our "raw" coordinates are not scaled. This allows us to only have to modify our stored
// coordinates when the UI is updated. It also simplifies our calculations as these
// coordinates are without respect to the current scale.

var imgWidth = null;
var imgHeight = null;
var viewportWidth = null;
var viewportHeight = null;
var scale = null;
var lastScale = null;
var container = null;
// var img = null;
var x = 0;
var lastX = 0;
var y = 0;
var lastY = 0;
var pinchCenter = null;

// We need to disable the following event handlers so that the browser doesn't try to
// automatically handle our image drag gestures.
var disableImgEventHandlers = function () {
  var events = ['onclick', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover',
                'onmouseup', 'ondblclick', 'onfocus', 'onblur'];

  events.forEach(function (event) {
    modalImg[event] = function () {
      return false;
    };
  });
};

// Traverse the DOM to calculate the absolute position of an element
var absolutePosition = function (el) {
  var x = 0,
    y = 0;

  while (el !== null) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent;
  }
  console.log( { x: x, y: y });
  return { x: x, y: y };
};

var restrictScale = function (scale) {
  if (scale < MIN_SCALE) {
    scale = MIN_SCALE;
  } else if (scale > MAX_SCALE) {
    scale = MAX_SCALE;
  }
  console.log(scale);
  return scale;
};

var restrictRawPos = function (pos, viewportDim, imgDim) {
  if (pos < viewportDim/scale - imgDim) { // too far left/up?
    pos = viewportDim/scale - imgDim;
  } else if (pos > 0) { // too far right/down?
    pos = 0;
  }
  return pos;
};

var updateLastPos = function (deltaX, deltaY) {
  lastX = x;
  lastY = y;
};

var translate = function (deltaX, deltaY) {
  // We restrict to the min of the viewport width/height or current width/height as the
  // current width/height may be smaller than the viewport width/height

  var newX = restrictRawPos(lastX + deltaX/scale,
                            Math.min(viewportWidth, curWidth), imgWidth);
  x = newX;
  modalImg.style.marginLeft = Math.ceil(newX*scale) + 'px';

  var newY = restrictRawPos(lastY + deltaY/scale,
                            Math.min(viewportHeight, curHeight), imgHeight);
  y = newY;
  modalImg.style.marginTop = Math.ceil(newY*scale) + 'px';
};

var zoom = function (scaleBy) {
  scale = restrictScale(lastScale*scaleBy);

  curWidth = imgWidth*scale;
  curHeight = imgHeight*scale;
  modalImg.style.width = Math.ceil(curWidth) + 'px';
  modalImg.style.height = Math.ceil(curHeight) + 'px';

  // Adjust margins to make sure that we aren't out of bounds
  translate(0, 0);
};

var rawCenter = function (e) {
  var pos = absolutePosition(container);

  // We need to account for the scroll position
  var scrollLeft = window.pageXOffset ? window.pageXOffset : document.body.scrollLeft;
  var scrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

  var zoomX = -x + (e.center.x - pos.x + scrollLeft)/scale;
  var zoomY = -y + (e.center.y - pos.y + scrollTop)/scale;

  return { x: zoomX, y: zoomY };
};

var updateLastScale = function () {
  lastScale = scale;
};

var zoomAround = function (scaleBy, rawZoomX, rawZoomY, doNotUpdateLast) {
  // Zoom
  zoom(scaleBy);
 
  // New raw center of viewport
  var rawCenterX = -x + Math.min(viewportWidth, curWidth)/2/scale;
  var rawCenterY = -y + Math.min(viewportHeight, curHeight)/2/scale;

  // Delta
  var deltaX = (rawCenterX - rawZoomX)*scale;
  var deltaY = (rawCenterY - rawZoomY)*scale;

  // Translate back to zoom center
  translate(deltaX, deltaY);

  if (!doNotUpdateLast) {
    updateLastScale();
    updateLastPos();
  }
};

var zoomCenter = function (scaleBy) {
   
  // Center of viewport
  var zoomX = -x + Math.min(viewportWidth, curWidth)/2/scale;
  var zoomY = -y + Math.min(viewportHeight, curHeight)/2/scale;

  zoomAround(scaleBy, zoomX, zoomY);
};

var zoomIn = document.getElementById("zoomIn");
var zoomOut = document.getElementById("zoomOut");
zoomIn.addEventListener("click",function(){
   
    zoomCenter(2);
});
zoomOut.addEventListener("click", function(){
  
    zoomCenter(1/2);
});

modalImg.addEventListener("load", function(){
    console.log("image loaded");
    console.log( { x: x, y: y });
    console.log(scale);


  container = modalImg.parentElement;

  disableImgEventHandlers();

  imgWidth = 1200;
  imgHeight = 882;
  console.log(imgWidth ,  imgHeight);
  viewportWidth =modalImg.parentElement.offsetWidth;
  scale = viewportWidth/imgWidth;
  lastScale = scale;
  viewportHeight = modalImg.parentElement.offsetHeight;
  curWidth = imgWidth*scale;
  curHeight = imgHeight*scale;

  var hammer = new Hammer(container, {
    domEvents: true
  });

  hammer.get('pinch').set({
    enable: true
  });

  hammer.on('pan', function (e) {
    translate(e.deltaX, e.deltaY);
  });

  hammer.on('panend', function (e) {
    updateLastPos();
  });

  hammer.on('pinch', function (e) {

    // We only calculate the pinch center on the first pinch event as we want the center to
    // stay consistent during the entire pinch
    if (pinchCenter === null) {
      pinchCenter = rawCenter(e);
      var offsetX = pinchCenter.x*scale - (-x*scale + Math.min(viewportWidth, curWidth)/2);
      var offsetY = pinchCenter.y*scale - (-y*scale + Math.min(viewportHeight, curHeight)/2);
      pinchCenterOffset = { x: offsetX, y: offsetY };
    }

    // When the user pinch zooms, she/he expects the pinch center to remain in the same
    // relative location of the screen. To achieve this, the raw zoom center is calculated by
    // first storing the pinch center and the scaled offset to the current center of the
    // image. The new scale is then used to calculate the zoom center. This has the effect of
    // actually translating the zoom center on each pinch zoom event.
    var newScale = restrictScale(scale*e.scale);
    var zoomX = pinchCenter.x*newScale - pinchCenterOffset.x;
    var zoomY = pinchCenter.y*newScale - pinchCenterOffset.y;
    var zoomCenter = { x: zoomX/newScale, y: zoomY/newScale };

    zoomAround(e.scale, zoomCenter.x, zoomCenter.y, true);
  });

  hammer.on('pinchend', function (e) {
    updateLastScale();
    updateLastPos();
    pinchCenter = null;
  });

  hammer.on('doubletap', function (e) {
    var c = rawCenter(e);
    zoomAround(2, c.x, c.y);
  });

});
 

// -----------------------------------------------------------------------------------------------------------------------------------------
    document.querySelector(".container").classList.remove("hidden");

    const pageFlip = new St.PageFlip(
        document.getElementById("demoBookExample"),
        {
            width: 860, // base page width
            height: 700, // base page height

            size: "fixed",
            
            flippingTime: 800,
            swipeDistance: 10,
            disableFlipByClick: true,
            maxShadowOpacity: 0.5, // Half shadow intensity
            showCover: false,
            mobileScrollSupport: false // disable content scrolling on mobile devices
        }
    );

    // load pages
    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    document.querySelector(".page-total").innerText = pageFlip.getPageCount();
    document.querySelector(
        ".page-orientation"
    ).innerText = pageFlip.getOrientation();

    document.querySelector(".btn-prev").addEventListener("click", () => {
        pageFlip.flipPrev(); // Turn to the previous page (with animation)
    });

    document.querySelector(".btn-next").addEventListener("click", () => {
        pageFlip.flipNext(); // Turn to the next page (with animation)
    });

    // triggered by page turning
    pageFlip.on("flip", (e) => {
        document.querySelector(".page-current").innerText = e.data + 1;
    });

    // triggered when the state of the book changes
    pageFlip.on("changeState", (e) => {
        document.querySelector(".page-state").innerText = e.data;
    });

    // triggered when page orientation changes
    pageFlip.on("changeOrientation", (e) => {
        document.querySelector(".page-orientation").innerText = e.data;
    });

    // home button function
    const home = document.querySelector("#home-btn")

    // Event Listener
    home.addEventListener("click", function (){
        while(document.querySelector(".page-current").innerText > 1){
        pageFlip.flipPrev();
        }
    });


});