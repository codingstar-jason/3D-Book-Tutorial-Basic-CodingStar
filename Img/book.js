

document.addEventListener('DOMContentLoaded', function() {
        
    window.onload = () => {
        // (A) GET ALL IMAGES
        let all = document.getElementsByTagName("img");
        console.log(all);
    
        // (B) CLICK TO GO FULLSCREEN
        
        if (all.length>0) { 
            for (let i of all) {
                var manager = new Hammer.Manager(i);
    
                //tap for desktop testing
                var Pinch = new Hammer.Pinch();
                
    
                manager.add(Pinch); 
            manager.on("pinch", (e) => {
                // (B1) EXIT FULLSCREEN
                console.log(e.target.src);
                console.log(e.target);
                if (document.fullscreenElement != null || document.webkitFullscreenElement != null) {
                    if (document.exitFullscreen) { 
                        document.exitFullscreen(); 
                    }
                    else { 
                        document.webkitCancelFullScreen(); }
                    }
    
                // (B2) ENTER FULLSCREEN
                else {
                if (e.target.requestFullscreen) 
                { e.target.requestFullscreen(); }
                else { e.target.webkitRequestFullScreen(); }
                }
          });
        }}
      };
    // Get the modal
    // var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    //var imgs = document.getElementById("myImg01");
    // var img2 = document.getElementById("myImg02");
    // var img3 = document.getElementById("myImg03");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("mod-caption");


    // var manager1 = new Hammer.Manager(imgs);
    // // var manager2 = new Hammer.Manager(img2);
    // // var manager3 = new Hammer.Manager(img3);

    // var modalManager = new Hammer.Manager(modalImg);
    
    // //tap for desktop testing
    // var Tap = new Hammer.Tap({
    //     taps: 1
    //   });
      
    // // var Tap2 = new Hammer.Tap({
    // // taps: 2
    // // });

    // manager1.add(Tap); 
    // // manager2.add(Tap); 
    // // manager3.add(Tap); 
    // // modalManager.add(Tap2)

    // // manager1.on('tap', openModal);

    // manager2.on('tap', openModal);

    // manager3.on('tap', openModal);

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



    
    // // Get the <span> element that closes the modal
    // var span = document.getElementsByClassName("close")[0];
    
    // // When the user clicks on <span> (x), close the modal
    // span.onclick = function() {
    //   modal.style.display = "none";
    // }

    // function openModal(e){
    //     modal.style.display = "block";
    //     modalImg.src = e.target.src;
    //     captionText.innerHTML = e.target.alt;
    // }

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