/* =====================================
   SOUK HMD
   APP.JS - النسخة القديمة
===================================== */

const SUPABASE_URL =
"https://mpanymikmqajpppipmxy.supabase.co";

const SUPABASE_KEY =
"sb_publishable_gFcCXJ4jzWl4P8CDBi-uhQ_Gkr1EHa4";


let ads = [];

let selectedCategory = "all";


/* =====================================
   SUPABASE REQUEST
===================================== */

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


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================
   OPEN ADD FORM
===================================== */

function openAdForm() {

    const modal =
        document.getElementById(
            "adModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "show"
    );

}


/* =====================================
   CLOSE ADD FORM
===================================== */

function closeAdForm() {

    const modal =
        document.getElementById(
            "adModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );

}


/* =====================================
   CATEGORY FILTER
===================================== */

function filterCategory(
    category,
    button
) {

    selectedCategory =
        category;


    document
        .querySelectorAll(
            ".category"
        )
        .forEach(
            function(btn) {

                btn.classList.remove(
                    "active"
                );

            }
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    showAds();

}


/* =====================================
   SEARCH
===================================== */

function searchAds() {

    showAds();

}


/* =====================================
   SHOW ADS
===================================== */

function showAds() {

    const box =
        document.getElementById(
            "ads"
        );


    if (!box) {

        return;

    }


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
        ads.filter(
            function(ad) {

                return (
                    ad.status ===
                    "approved"
                );

            }
        );


    const result =
        approvedAds.filter(
            function(ad) {

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
                    selectedCategory ===
                    "all"
                    ||
                    ad.category ===
                    selectedCategory;


                const searchOK =
                    title.includes(
                        search
                    )
                    ||
                    description.includes(
                        search
                    );


                return (
                    categoryOK &&
                    searchOK
                );

            }
        );


    box.innerHTML = "";


    if (
        result.length === 0
    ) {

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


    result.forEach(
        function(ad) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "ad-card";


            let imageHTML = `

                <div
                    class="ad-no-image"
                >

                    📦

                </div>

            `;


            if (ad.image_url) {

                imageHTML = `

                    <img
                        src="${escapeHTML(
                            ad.image_url
                        )}"
                        alt="${escapeHTML(
                            ad.title
                        )}"
                        loading="lazy"
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

                        ${escapeHTML(
                            ad.title
                        )}

                    </div>


                    <div class="ad-price">

                        ${Number(
                            ad.price || 0
                        ).toLocaleString(
                            "fr-DZ"
                        )}

                        دج

                    </div>


                    <div
                        class="ad-description"
                    >

                        ${escapeHTML(
                            ad.description
                        )}

                    </div>


                    <div
                        class="ad-location"
                    >

                        📍
                        ${escapeHTML(
                            ad.city
                        )}

                    </div>


                    <button
                        class="contact-button"
                        onclick="
                            contactSeller(
                                '${escapeHTML(
                                    ad.phone
                                )}',
                                '${escapeHTML(
                                    ad.title
                                )}'
                            )
                        "
                    >

                        📞 تواصل مع البائع

                    </button>

                </div>

            `;


            box.appendChild(
                card
            );

        }
    );

}


/* =====================================
   CONTACT SELLER
===================================== */

function contactSeller(
    phone,
    title
) {

    let cleanPhone =
        String(
            phone || ""
        )
        .replace(
            /\s+/g,
            ""
        );


    if (
        cleanPhone.startsWith(
            "0"
        )
    ) {

        cleanPhone =
            "213" +
            cleanPhone.substring(
                1
            );

    }


    const message =
        "السلام عليكم، مهتم بالسلعة: " +
        title;


    const url =
        "https://wa.me/" +
        cleanPhone +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank"
    );

}


/* =====================================
   SUBMIT AD + PAYMENT
===================================== */

async function submitAd(
    event
) {

    event.preventDefault();


    const title =
        document
            .getElementById(
                "adTitle"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "adCategory"
            )
            .value;


    const price =
        Number(
            document
                .getElementById(
                    "adPrice"
                )
                .value
        );


    const description =
        document
            .getElementById(
                "adDescription"
            )
            .value
            .trim();


    const phone =
        document
            .getElementById(
                "adPhone"
            )
            .value
            .trim();


    const city =
        document
            .getElementById(
                "adCity"
            )
            .value
            .trim();


    /* PAYMENT METHOD */

    const paymentMethodElement =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    const paymentMethod =
        paymentMethodElement
            ? paymentMethodElement.value
            : "";


    /* PAYMENT PROOF */

    const paymentProof =
        document.getElementById(
            "paymentProof"
        );


    const paymentFile =
        paymentProof &&
        paymentProof.files
            ? paymentProof.files[0]
            : null;


    /* VALIDATION */

    if (!title) {

        alert(
            "اكتب عنوان السلعة"
        );

        return;

    }


    if (!category) {

        alert(
            "اختر التصنيف"
        );

        return;

    }


    if (!price || price <= 0) {

        alert(
            "اكتب سعر صحيح"
        );

        return;

    }


    if (!description) {

        alert(
            "اكتب وصف السلعة"
        );

        return;

    }


    if (!phone) {

        alert(
            "اكتب رقم الهاتف"
        );

        return;

    }


    if (!city) {

        alert(
            "اكتب البلدية"
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


    /* ONLY IMAGES */

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


    /* MAX 5 MB */

    if (
        paymentFile.size >
        5 * 1024 * 1024
    ) {

        alert(
            "حجم الصورة يجب أن يكون أقل من 5 ميغابايت"
        );

        return;

    }


    const button =
        document.querySelector(
            ".submit-ad"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "جاري رفع إثبات الدفع...";

    }


    try {


        /* =====================================
           UPLOAD PAYMENT PROOF
        ===================================== */

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

                    method:
                        "POST",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_KEY,

                        "Content-Type":
                            paymentFile.type

                    },

                    body:
                        paymentFile

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


        /* PUBLIC URL */

        const paymentProofURL =
            SUPABASE_URL +
            "/storage/v1/object/public/payment-proofs/" +
            fileName;


        if (button) {

            button.textContent =
                "جاري إرسال الإعلان...";

        }


        /* =====================================
           INSERT AD
        ===================================== */

        await supabaseRequest(
            "/rest/v1/ads",
            {

                method:
                    "POST",

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


        /* RESET */

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
            "📷 تم استلام إثبات الدفع\n\n" +
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

            button.disabled =
                false;

            button.textContent =
                "نشر الإعلان";

        }

    }

}


/* =====================================
   LOAD APPROVED ADS ONLY
===================================== */

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


        ads =
            ads.filter(
                function(ad) {

                    return (
                        ad.status ===
                        "approved"
                    );

                }
            );


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


/* =====================================
   MODAL CLICK
===================================== */

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


/* =====================================
   SEARCH EVENT
===================================== */

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


/* =====================================
   START
===================================== */

loadAds();
