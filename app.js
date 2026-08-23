const SUPABASE_URL =
"https://mpanymikmqajpppipmxy.supabase.co";

const SUPABASE_KEY =
"sb_publishable_gFcCXJ4jzWl4P8CDBi-uhQ_Gkr1EHa4";

let ads = [];
let selectedCategory = "all";


async function supabaseRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            SUPABASE_URL + endpoint,
            {
                ...options,

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Content-Type":
                        "application/json",

                    ...(options.headers || {})

                }

            }
        );


    const text =
        await response.text();


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

    }

    catch (error) {

        return text;

    }

}


function escapeHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function openAdForm() {

    const modal =
        document.getElementById(
            "adModal"
        );

    if (!modal) return;

    modal.classList.add("show");

}


function closeAdForm() {

    const modal =
        document.getElementById(
            "adModal"
        );

    if (!modal) return;

    modal.classList.remove("show");

}


function filterCategory(
    category,
    button
) {

    selectedCategory =
        category;

    document
        .querySelectorAll(".category")
        .forEach(function(btn) {

            btn.classList.remove(
                "active"
            );

        });

    if (button) {

        button.classList.add(
            "active"
        );

    }

    showAds();

}


function searchAds() {

    showAds();

}


/* =========================================
   PRODUCT IMAGES
========================================= */

function buildProductImages(ad) {

    const images = [];

    if (ad.image_url_1) {

        images.push(
            ad.image_url_1
        );

    }

    if (ad.image_url_2) {

        images.push(
            ad.image_url_2
        );

    }

    if (ad.image_url_3) {

        images.push(
            ad.image_url_3
        );

    }

    if (
        images.length === 0 &&
        ad.image_url
    ) {

        images.push(
            ad.image_url
        );

    }


    /* NO IMAGE */

    if (images.length === 0) {

        return `
            <div class="ad-no-image">
                📦
            </div>
        `;

    }


    /* ONE IMAGE */

    if (images.length === 1) {

        const url =
            escapeHTML(images[0]);

        return `
            <img
                src="${url}"
                alt="${escapeHTML(ad.title)}"
                loading="lazy"
                onclick="window.open('${url}','_blank')"
            >
        `;

    }


    /* MULTIPLE IMAGES */

    return `
        <div
            class="product-images-slider"
            style="
                width:100%;
                height:100%;
                display:flex;
                gap:8px;
                overflow-x:auto;
                overflow-y:hidden;
                scroll-snap-type:x mandatory;
                scrollbar-width:none;
            "
        >

            ${images.map(function(url) {

                const safeURL =
                    escapeHTML(url);

                return `
                    <img
                        src="${safeURL}"
                        alt="${escapeHTML(ad.title)}"
                        loading="lazy"
                        onclick="window.open('${safeURL}','_blank')"
                        style="
                            width:100%;
                            min-width:100%;
                            height:100%;
                            flex:0 0 100%;
                            object-fit:cover;
                            object-position:center;
                            scroll-snap-align:center;
                            cursor:pointer;
                            background:#f1f3f5;
                        "
                    >
                `;

            }).join("")}

        </div>

        <div
            style="
                position:absolute;
                bottom:8px;
                left:50%;
                transform:translateX(-50%);
                background:rgba(0,0,0,.65);
                color:#fff;
                padding:5px 10px;
                border-radius:20px;
                font-size:11px;
                z-index:10;
            "
        >
            📷 ${images.length} صور
        </div>
    `;

}


/* =========================================
   SHOW ADS
========================================= */

function showAds() {

    const box =
        document.getElementById(
            "ads"
        );

    if (!box) return;


    const searchInput =
        document.getElementById(
            "search"
        );

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const approvedAds =
        ads.filter(function(ad) {

            return (
                ad.status ===
                "approved"
            );

        });


    const result =
        approvedAds.filter(function(ad) {

            const title =
                String(
                    ad.title || ""
                )
                .toLowerCase();

            const description =
                String(
                    ad.description || ""
                )
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
            document.createElement(
                "div"
            );


        card.className =
            "ad-card";


        const productImages =
            buildProductImages(ad);


        card.innerHTML = `

            <div
                class="ad-image"
            >
                ${productImages}
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
                    ${escapeHTML(ad.city)}

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


/* =========================================
   WHATSAPP
========================================= */

function contactSeller(
    phone,
    title
) {

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
        "_blank"
    );

}


/* =========================================
   UPLOAD PRODUCT IMAGE
========================================= */

async function uploadProductImage(
    file,
    index
) {

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
            "كل صورة للسلعة يجب أن تكون أقل من 5 ميغابايت."
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


    const uploadResponse =
        await fetch(
            SUPABASE_URL +
            "/storage/v1/object/ad-images/" +
            fileName,
            {

                method:"POST",

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Content-Type":
                        file.type

                },

                body:file

            }
        );


    const uploadText =
        await uploadResponse.text();


    if (!uploadResponse.ok) {

        throw new Error(
            "فشل رفع صورة السلعة: " +
            uploadText
        );

    }


    return (
        SUPABASE_URL +
        "/storage/v1/object/public/ad-images/" +
        fileName
    );

}


/* =========================================
   UPLOAD PAYMENT PROOF
========================================= */

async function uploadPaymentProof(
    paymentFile
) {

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


    const uploadResponse =
        await fetch(
            SUPABASE_URL +
            "/storage/v1/object/payment-proofs/" +
            fileName,
            {

                method:"POST",

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Content-Type":
                        paymentFile.type

                },

                body:paymentFile

            }
        );


    const uploadText =
        await uploadResponse.text();


    if (!uploadResponse.ok) {

        throw new Error(
            "فشل رفع صورة إثبات الدفع: " +
            uploadText
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


    const adImagesInput =
        document.getElementById(
            "adImages"
        );


    const productFiles =
        adImagesInput &&
        adImagesInput.files
            ? Array.from(
                adImagesInput.files
            )
            : [];


    const paymentMethodElement =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    const paymentMethod =
        paymentMethodElement
            ? paymentMethodElement.value
            : "";


    const paymentProof =
        document.getElementById(
            "paymentProof"
        );


    const paymentFile =
        paymentProof &&
        paymentProof.files
            ? paymentProof.files[0]
            : null;


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


    if (
        productFiles.length === 0
    ) {

        alert(
            "أضف صورة واحدة على الأقل للسلعة"
        );

        return;

    }


    if (
        productFiles.length > 3
    ) {

        alert(
            "يمكنك إضافة 3 صور فقط للسلعة"
        );

        return;

    }


    if (!paymentMethod) {

        alert("اختر طريقة الدفع");
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
            "يجب إرفاق صورة فقط"
        );

        return;

    }


    if (
        paymentFile.size >
        5 * 1024 * 1024
    ) {

        alert(
            "حجم صورة إثبات الدفع يجب أن يكون أقل من 5 ميغابايت"
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
                    "جاري رفع صورة " +
                    (i + 1) +
                    " من " +
                    productFiles.length +
                    "...";

            }


            const imageURL =
                await uploadProductImage(
                    productFiles[i],
                    i + 1
                );


            uploadedImages.push(
                imageURL
            );

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

                method:"POST",

                headers: {

                    "Prefer":
                        "return=minimal"

                },

                body:
                    JSON.stringify({

                        title:title,

                        category:category,

                        price:price,

                        description:description,

                        phone:phone,

                        city:city,

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
            "❌ حدث خطأ أثناء إرسال الإعلان\n\n" +
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


        if (
            Array.isArray(data)
        ) {

            ads = data;

        }

        else {

            ads = [];

        }


        showAds();

    }

    catch (error) {

        console.error(
            "Load ads error:",
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
   MODAL
========================================= */

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


/* =========================================
   SEARCH
========================================= */

const searchInput =
    document.
