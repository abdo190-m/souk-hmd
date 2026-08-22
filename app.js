/* =====================================
   SOUK HMD
   APP.JS
===================================== */

let ads = [];

let selectedCategory = "all";


/* =====================================
   OPEN ADD FORM
===================================== */

function openAdForm(){

    const modal =
        document.getElementById("adModal");

    if(!modal){
        return;
    }

    modal.classList.add("show");

}


/* =====================================
   CLOSE ADD FORM
===================================== */

function closeAdForm(){

    const modal =
        document.getElementById("adModal");

    if(!modal){
        return;
    }

    modal.classList.remove("show");

}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(text){

    return String(text || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =====================================
   CATEGORY FILTER
===================================== */

function filterCategory(
    category,
    button
){

    selectedCategory = category;


    document
        .querySelectorAll(".category")
        .forEach(function(btn){

            btn.classList.remove("active");

        });


    if(button){

        button.classList.add("active");

    }


    showAds();

}


/* =====================================
   SEARCH
===================================== */

function searchAds(){

    showAds();

}


/* =====================================
   SHOW ADS
===================================== */

function showAds(){

    const box =
        document.getElementById("ads");

    if(!box){
        return;
    }


    const searchInput =
        document.getElementById("search");


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const result =
        ads.filter(function(ad){

            const title =
                String(ad.title || "")
                    .toLowerCase();

            const description =
                String(ad.description || "")
                    .toLowerCase();


            const categoryOK =
                selectedCategory === "all" ||
                ad.category === selectedCategory;


            const searchOK =
                title.includes(search) ||
                description.includes(search);


            return (
                categoryOK &&
                searchOK
            );

        });


    box.innerHTML = "";


    if(result.length === 0){

        box.innerHTML = `

            <div class="empty">

                📦

                <h3>
                    لا توجد إعلانات حاليًا
                </h3>

                <p>
                    كن أول شخص يضيف إعلانًا!
                </p>

            </div>

        `;

        return;

    }


    result.forEach(function(ad){

        const card =
            document.createElement("div");

        card.className =
            "ad-card";


        let imageHTML = `

            <div class="ad-no-image">
                📦
            </div>

        `;


        if(ad.image){

            imageHTML = `

                <img
                    src="${escapeHTML(ad.image)}"
                    alt="${escapeHTML(ad.title)}"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='flex';
                    "
                >

                <div
                    class="ad-no-image"
                    style="display:none"
                >
                    📦
                </div>

            `;

        }


        card.innerHTML = `

            <div class="ad-image">

                ${imageHTML}

            </div>


            <div class="ad-info">

                <div class="ad-title">

                    ${escapeHTML(ad.title)}

                </div>


                <div class="ad-price">

                    ${Number(ad.price)
                        .toLocaleString("fr-DZ")
                    }

                    دج

                </div>


                <div class="ad-description">

                    ${escapeHTML(ad.description)}

                </div>


                <div class="ad-location">

                    📍 ${escapeHTML(ad.city)}

                </div>


                <button
                    class="contact-button"
                    onclick="
                        contactSeller(
                            '${escapeHTML(ad.phone)}',
                            '${escapeHTML(ad.title)}'
                        )
                    "
                >

                    📞 تواصل مع البائع

                </button>

            </div>

        `;


        box.appendChild(card);

    });

}


/* =====================================
   CONTACT SELLER
===================================== */

function contactSeller(
    phone,
    title
){

    const cleanPhone =
        String(phone || "")
            .replace(/\s+/g,"")
            .replace(/^0/,"213");


    const message =
        "السلام عليكم، مهتم بالسلعة: " +
        title;


    const url =
        "https://wa.me/" +
        cleanPhone +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        url,
        "_blank"
    );

}


/* =====================================
   SUBMIT AD
===================================== */

function submitAd(event){

    event.preventDefault();


    const title =
        document
            .getElementById("adTitle")
            .value
            .trim();


    const category =
        document
            .getElementById("adCategory")
            .value;


    const price =
        Number(
            document
                .getElementById("adPrice")
                .value
        );


    const description =
        document
            .getElementById("adDescription")
            .value
            .trim();


    const phone =
        document
            .getElementById("adPhone")
            .value
            .trim();


    const city =
        document
            .getElementById("adCity")
            .value
            .trim();


    if(!title){

        alert(
            "اكتب عنوان السلعة"
        );

        return;

    }


    if(!category){

        alert(
            "اختر التصنيف"
        );

        return;

    }


    if(!price || price <= 0){

        alert(
            "اكتب سعر صحيح"
        );

        return;

    }


    if(!description){

        alert(
            "اكتب وصف السلعة"
        );

        return;

    }


    if(!phone){

        alert(
            "اكتب رقم الهاتف"
        );

        return;

    }


    if(!city){

        alert(
            "اكتب البلدية"
        );

        return;

    }


    const newAd = {

        id:
            Date.now(),

        title:
            title,

        category:
            category,

        price:
            price,

        description:
            description,

        phone:
            phone,

        city:
            city,

        image:
            ""

    };


    ads.unshift(newAd);


    saveAds();


    showAds();


    document
        .getElementById("adForm")
        .reset();


    document
        .getElementById("adCity")
        .value =
        "حاسي مسعود";


    closeAdForm();


    alert(
        "تم نشر الإعلان بنجاح ✅"
    );

}


/* =====================================
   SAVE ADS
===================================== */

function saveAds(){

    localStorage.setItem(
        "souk_hmd_ads",
        JSON.stringify(ads)
    );

}


/* =====================================
   LOAD ADS
===================================== */

function loadAds(){

    try{

        const saved =
            localStorage.getItem(
                "souk_hmd_ads"
            );


        if(saved){

            ads =
                JSON.parse(saved);

        }

    }

    catch(error){

        console.error(
            "Ads loading error:",
            error
        );

        ads = [];

    }


    showAds();

}


/* =====================================
   CLOSE MODAL BY CLICKING OUTSIDE
===================================== */

const modal =
    document.getElementById("adModal");


if(modal){

    modal.addEventListener(
        "click",
        function(event){

            if(
                event.target === modal
            ){

                closeAdForm();

            }

        }
    );

}


/* =====================================
   START
===================================== */

loadAds();
