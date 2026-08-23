/* =========================================
   SOUK HMD — APP.JS
   PRODUCT IMAGE SLIDER + SWIPE
========================================= */

const SUPABASE_URL =
    "https://mpanymikmqajpppipmxy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_gFcCXJ4jzWl4P8CDBi-uhQ_Gkr1EHa4";

let ads = [];
let selectedCategory = "all";
let sliderCounter = 0;


/* =========================================
   SUPABASE REQUEST
========================================= */

async function supabaseRequest(endpoint, options = {}) {

    const response = await fetch(
        SUPABASE_URL + endpoint,
        {
            ...options,

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    const text = await response.text();

    if (!response.ok) {
        throw new Error(
            "Supabase HTTP " +
            response.status +
            " - " +
            text
        );
    }

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   MODAL
========================================= */

function openAdForm() {

    const modal =
        document.getElementById("adModal");

    if (modal) {
        modal.classList.add("show");
    }
}


function closeAdForm() {

    const modal =
        document.getElementById("adModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


/* =========================================
   CATEGORY
========================================= */

function filterCategory(category, button) {

    selectedCategory = category;

    document
        .querySelectorAll(".category")
        .forEach(function(btn) {
            btn.classList.remove("active");
        });

    if (button) {
        button.classList.add("active");
    }

    showAds();
}


/* =========================================
   SEARCH
========================================= */

function searchAds() {
    showAds();
}


/* =========================================
   GET PRODUCT IMAGES
========================================= */

function getProductImages(ad) {

    const images = [];

    if (ad.image_url_1) {
        images.push(ad.image_url_1);
    }

    if (ad.image_url_2) {
        images.push(ad.image_url_2);
    }

    if (ad.image_url_3) {
        images.push(ad.image_url_3);
    }

    if (
        images.length === 0 &&
        ad.image_url
    ) {
        images.push(ad.image_url);
    }

    return images;
}


/* =========================================
   BUILD PRODUCT SLIDER
========================================= */

function buildProductImages(ad) {

    const images = getProductImages(ad);

    if (images.length === 0) {

        return `
            <div class="ad-no-image">
                📦
            </div>
        `;
    }

    sliderCounter++;

    const sliderId =
        "product-slider-" + sliderCounter;

    const imagesHTML =
        images.map(function(url, index) {

            return `
                <img
                    class="product-main-image ${
                        index === 0 ? "active" : ""
                    }"
                    src="${escapeHTML(url)}"
                    alt="${escapeHTML(ad.title)}"
                    loading="lazy"
                    draggable="false"
                    onclick="openProductImage(this.src)"
                    onerror="this.style.display='none'"
                >
            `;

        }).join("");


    const dotsHTML =
        images.map(function(url, index) {

            return `
                <button
                    type="button"
                    class="slider-dot ${
                        index === 0 ? "active" : ""
                    }"
                    onclick="
                        changeProductImage(
                            '${sliderId}',
                            ${index}
                        )
                    "
                    aria-label="الصورة ${index + 1}"
                ></button>
            `;

        }).join("");


    return `

        <div
            class="product-gallery"
            id="${sliderId}"
            data-current="0"
            data-count="${images.length}"
        >

            ${imagesHTML}


            ${
                images.length > 1
                ?

                `

                    <!-- PREVIOUS -->

                    <button
                        type="button"
                        class="slider-arrow slider-prev"
                        onclick="
                            changeProductImage(
                                '${sliderId}',
                                -1
                            )
                        "
                    >
                        ❮
                    </button>


                    <!-- NEXT -->

                    <button
                        type="button"
                        class="slider-arrow slider-next"
                        onclick="
                            changeProductImage(
                                '${sliderId}',
                                1
                            )
                        "
                    >
                        ❯
                    </button>


                    <!-- DOTS -->

                    <div class="slider-dots">
                        ${dotsHTML}
                    </div>


                    <!-- NUMBER -->

                    <div class="image-count">

                        <span class="current-image-number">
                            1
                        </span>

                        /

                        <span class="total-image-number">
                            ${images.length}
                        </span>

                    </div>

                `

                :

                ""

            }

        </div>

    `;
}


/* =========================================
   CHANGE PRODUCT IMAGE
========================================= */

function changeProductImage(sliderId, direction) {

    const slider =
        document.getElementById(sliderId);

    if (!slider) return;


    const images =
        slider.querySelectorAll(
            ".product-main-image"
        );

    if (!images.length) return;


    let currentIndex =
        parseInt(
            slider.dataset.current || "0"
        );


    let newIndex;


    /* NEXT */

    if (direction === 1) {

        newIndex =
            currentIndex + 1;

        if (
            newIndex >= images.length
        ) {
            newIndex = 0;
        }

    }

    /* PREVIOUS */

    else if (direction === -1) {

        newIndex =
            currentIndex - 1;

        if (
            newIndex < 0
        ) {
            newIndex =
                images.length - 1;
        }

    }

    /* DIRECT DOT */

    else {

        newIndex =
            Number(direction);

    }


    /* SAVE CURRENT INDEX */

    slider.dataset.current =
        newIndex;


    /* CHANGE IMAGES */

    images.forEach(
        function(image, index) {

            image.classList.toggle(
                "active",
                index === newIndex
            );

        }
    );


    /* CHANGE DOTS */

    const dots =
        slider.querySelectorAll(
            ".slider-dot"
        );


    dots.forEach(
        function(dot, index) {

            dot.classList.toggle(
                "active",
                index === newIndex
            );

        }
    );


    /* CHANGE NUMBER */

    const number =
        slider.querySelector(
            ".current-image-number"
        );


    if (number) {

        number.textContent =
            newIndex + 1;

    }

}


/* =========================================
   SWIPE SUPPORT
========================================= */

function enableSliderSwipe(slider) {

    if (!slider) return;

    let startX = 0;
    let startY = 0;

    let isMoving = false;


    /* TOUCH START */

    slider.addEventListener(
        "touchstart",
        function(event) {

            if (
                !event.touches ||
                !event.touches.length
            ) {
                return;
            }


            startX =
                event.touches[0].clientX;

            startY =
                event.touches[0].clientY;

            isMoving = true;

        },
        {
            passive: true
        }
    );


    /* TOUCH END */

    slider.addEventListener(
        "touchend",
        function(event) {

            if (!isMoving) return;

            isMoving = false;


            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {
                return;
            }


            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;


            const diffX =
                endX - startX;

            const diffY =
                endY - startY;


            /* IGNORE VERTICAL SWIPE */

            if (
                Math.abs(diffY) >
                Math.abs(diffX)
            ) {
                return;
            }


            /* MINIMUM SWIPE DISTANCE */

            if (
                Math.abs(diffX) < 40
            ) {
                return;
            }


            /*
                RTL:
                SWIPE LEFT  = NEXT
                SWIPE RIGHT = PREVIOUS
            */

            if (diffX < 0) {

                changeProductImage(
                    slider.id,
                    1
                );

            } else {

                changeProductImage(
                    slider.id,
                    -1
                );

            }

        },
        {
            passive: true
        }
    );
}


/* =========================================
   OPEN IMAGE FULL SIZE
========================================= */

function openProductImage(url) {

    if (!url) return;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================
   SHOW ADS
========================================= */

function showAds() {

    const box =
        document.getElementById("ads");

    if (!box) return;


    const searchInput =
        document.getElementById("search");


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const result =
        ads.filter(function(ad) {

            if (
                ad.status !==
                "approved"
            ) {
                return false;
            }


            const title =
                String(
                    ad.title || ""
                ).toLowerCase();


            const description =
                String(
                    ad.description || ""
                ).toLowerCase();


            const categoryOK =
                selectedCategory === "all" ||
                ad.category === selectedCategory;


            const searchOK =
                !search ||
                title.includes(search) ||
                description.includes(search);


            return (
                categoryOK &&
                searchOK
            );

        });


    box.innerHTML = "";


    if (result.length === 0) {

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


    result.forEach(function(ad) {

        const card =
            document.createElement("div");


        card.className =
            "ad-card";


        card.innerHTML = `

            <div class="ad-image">

                ${buildProductImages(ad)}

            </div>


            <div class="ad-info">

                <div class="ad-title">
                    ${escapeHTML(ad.title)}
                </div>


                <div class="ad-price">

                    ${Number(
                        ad.price || 0
                    ).toLocaleString("fr-DZ")}

                    دج

                </div>


                <div class="ad-description">

                    ${escapeHTML(
                        ad.description
                    )}

                </div>


                <div class="ad-location">

                    📍

                    ${escapeHTML(
                        ad.city
                    )}

                </div>


                <button
                    class="contact-button"
                    type="button"
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


        /* ENABLE SWIPE */

        const slider =
            card.querySelector(
                ".product-gallery"
            );


        if (slider) {

            enableSliderSwipe(
                slider
            );

        }

    });
}


/* =========================================
   WHATSAPP
========================================= */

function contactSeller(phone, title) {

    let cleanPhone =
        String(phone || "")
            .replace(/\s+/g, "");


    if (
        cleanPhone.startsWith("0")
    ) {

        cleanPhone =
            "213" +
            cleanPhone.substring(1);

    }


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
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================
   UPLOAD PRODUCT IMAGE
========================================= */

async function uploadProductImage(file, index) {

    if (
        !file ||
        !file.type.startsWith("image/")
    ) {

        throw new Error(
            "صور السلعة يجب أن تكون صورًا فقط."
        );
    }


    if (
        file.size >
        5 * 1024 * 1024
    ) {

        throw new Error(
            "كل صورة يجب أن تكون أقل من 5 ميغابايت."
        );
    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "ad-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2) +
        "-" +
        index +
        "." +
        extension;


    const response =
        await fetch(
            SUPABASE_URL +
            "/storage/v1/object/ad-images/" +
            fileName,
            {

                method: "POST",

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Content-Type":
                        file.type

                },

                body: file

            }
        );


    const text =
        await response.text();


    if (!response.ok) {

        throw new Error(
            "فشل رفع صورة السلعة: " +
            text
        );
    }


    return (
        SUPABASE_URL +
        "/storage/v1/object/public/ad-images/" +
        fileName
    );
}


/* =========================================
   PAYMENT PROOF
========================================= */

async function uploadPaymentProof(paymentFile) {

    const extension =
        paymentFile.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "payment-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2) +
        "." +
        extension;


    const response =
        await fetch(
            SUPABASE_URL +
            "/storage/v1/object/payment-proofs/" +
            fileName,
            {

                method: "POST",

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Content-Type":
                        paymentFile.type

                },

                body: paymentFile

            }
        );


    const text =
        await response.text();


    if (!response.ok) {

        throw new Error(
            "فشل رفع إثبات الدفع: " +
            text
        );
    }


    return (
        SUPABASE_URL +
        "/storage/v1/object/public/payment-proofs/" +
        fileName
    );
}


/* =========================================
   SUBMIT AD
========================================= */

async function submitAd(event) {

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


    const imageInput =
        document.getElementById(
            "adImages"
        );


    const productFiles =
        imageInput &&
        imageInput.files
            ? Array.from(imageInput.files)
            : [];


    const paymentMethodElement =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    const paymentMethod =
        paymentMethodElement
            ? paymentMethodElement.value
            : "";


    const paymentInput =
        document.getElementById(
            "paymentProof"
        );


    const paymentFile =
        paymentInput &&
        paymentInput.files
            ? paymentInput.files[0]
            : null;


    /* VALIDATION */

    if (!title) {
        alert("اكتب عنوان السلعة");
        return;
    }


    if (!category) {
        alert("اختر التصنيف");
        return;
    }


    if (!price || price <= 0) {
        alert("اكتب سعر صحيح");
        return;
    }


    if (!description) {
        alert("اكتب وصف السلعة");
        return;
    }


    if (!phone) {
        alert("اكتب رقم الهاتف");
        return;
    }


    if (!city) {
        alert("اكتب البلدية");
        return;
    }


    if (productFiles.length === 0) {

        alert(
            "أضف صورة واحدة على الأقل للسلعة"
        );

        return;
    }


    if (productFiles.length > 3) {

        alert(
            "يمكنك إضافة 3 صور فقط"
        );

        return;
    }


    if (!paymentMethod) {

        alert(
            "اختر طريقة الدفع"
        );

        return;
    }


    if (!paymentFile) {

        alert(
            "أرفق صورة إثبات الدفع"
        );

        return;
    }


    if (
        !paymentFile.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "إثبات الدفع يجب أن يكون صورة"
        );

        return;
    }


    if (
        paymentFile.size >
        5 * 1024 * 1024
    ) {

        alert(
            "حجم إثبات الدفع يجب أن يكون أقل من 5 ميغابايت"
        );

        return;
    }


    const button =
        document.querySelector(
            ".submit-ad"
        );


    if (button) {
        button.disabled = true;
    }


    try {

        const uploadedImages = [];


        for (
            let i = 0;
            i < productFiles.length;
            i++
        ) {

            if (button) {

                button.textContent =
                    "جاري رفع الصورة " +
                    (i + 1) +
                    " من " +
                    productFiles.length +
                    "...";

            }


            const url =
                await uploadProductImage(
                    productFiles[i],
                    i + 1
                );


            uploadedImages.push(url);

        }


        if (button) {

            button.textContent =
                "جاري رفع إثبات الدفع...";

        }


        const paymentProofURL =
            await uploadPaymentProof(
                paymentFile
            );


        if (button) {

            button.textContent =
                "جاري إرسال الإعلان...";

        }


        await supabaseRequest(
            "/rest/v1/ads",
            {

                method: "POST",

                headers: {

                    "Prefer":
                        "return=minimal"

                },

                body:
                    JSON.stringify({

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

                        image_url:
                            uploadedImages[0] ||
                            null,

                        image_url_1:
                            uploadedImages[0] ||
                            null,

                        image_url_2:
                            uploadedImages[1] ||
                            null,

                        image_url_3:
                            uploadedImages[2] ||
                            null,

                        status:
                            "pending",

                        payment_method:
                            paymentMethod,

                        payment_proof_url:
                            paymentProofURL,

                        payment_status:
                            "pending"

                    })

            }

        );


        const form =
            document.getElementById(
                "adForm"
            );


        if (form) {
            form.reset();
        }


        const cityInput =
            document.getElementById(
                "adCity"
            );


        if (cityInput) {

            cityInput.value =
                "حاسي مسعود";

        }


        closeAdForm();


        alert(
            "✅ تم إرسال إعلانك بنجاح\n\n" +
            "💰 رسوم النشر: 500 دج\n" +
            "📷 تم استلام الصور وإثبات الدفع\n\n" +
            "الإعلان الآن قيد المراجعة."
        );


        await loadAds();

    }

    catch (error) {

        console.error(
            "SUBMIT AD ERROR:",
            error
        );


        alert(
            "❌ حدث خطأ\n\n" +
            error.message
        );

    }

    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "نشر الإعلان";

        }

    }

}


/* =========================================
   LOAD ADS
========================================= */

async function loadAds() {

    const box =
        document.getElementById(
            "ads"
        );


    if (box) {

        box.innerHTML = `

            <div class="empty">

                ⏳

                <h3>
                    جاري تحميل الإعلانات...
                </h3>

            </div>

        `;

    }


    try {

        const data =
            await supabaseRequest(
                "/rest/v1/ads?select=*&status=eq.approved&order=created_at.desc"
            );


        ads =
            Array.isArray(data)
                ? data
                : [];


        showAds();

    }

    catch (error) {

        console.error(
            "LOAD ADS ERROR:",
            error
        );


        ads = [];


        if (box) {

            box.innerHTML = `

                <div class="empty">

                    ❌

                    <h3>
                        حدث خطأ في تحميل الإعلانات
                    </h3>

                </div>

            `;

        }

    }

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const modal =
            document.getElementById(
                "adModal"
            );


        if (modal) {

            modal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeAdForm();

                    }

                }
            );

        }


        const searchInput =
            document.getElementById(
                "search"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchAds
            );

        }


        loadAds();

    }
);
