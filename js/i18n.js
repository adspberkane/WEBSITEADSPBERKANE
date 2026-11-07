/**
 * Blood Donors Association of Berkane Province
 * Association des Donneurs de Sang de la Province de Berkane
 * جمعية المتبرعين بالدم بإقليم بركان
 * 
 * Bilingual (Arabic AR / French FR) Translation Engine
 * File: js/i18n.js
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'blood_donors_lang';

  /**
   * Complete bilingual translation dictionaries
   */
  var translations = {
    ar: {
      resources_title: "الأسئلة والمعلومات",
      resources_subtitle: "كل ما يساعدك على فهم التسجيل والتبرع بالدم.",
      resources_faq_title: "الأسئلة الشائعة",
      resources_faq_description: "التسجيل، الخصوصية واستعمال الموقع",
      resources_facts_title: "التبرع بالدم: أسئلة وحقائق",
      resources_facts_description: "حول التبرع بالدم والشائعات المتداولة",
      resources_back: "العودة إلى الرئيسية",
      registration_success_donor_title: "تم استلام طلب التبرع بنجاح",
      registration_success_volunteer_title: "تم استلام طلب التطوع بنجاح",
      registration_success_team_title: "تم استلام طلب تسجيل الفريق بنجاح",
      registration_success_description: "شكراً لمبادرتك. ستراجع إدارة الجمعية المعلومات التي أرسلتها، وتتواصل معك عند الحاجة لتنسيق مشاركتك. لا حاجة إلى إعادة إرسال الطلب.",
      registration_success_acknowledge: "فهمت",
      privacy_link: "سياسة الخصوصية",
      privacy_back: "العودة إلى الموقع",
      // Logo & Badge
      nav_logo_text: "متبرعو بركان",
      hero_badge: "جمعية المتبرعين بالدم بإقليم بركان",

      // Emergency Banner
      emergency_text: "",
      emergency_btn: "تفاصيل النداء",

      // Navbar
      nav_home: "الرئيسية",
      nav_about: "من نحن",
      nav_compatibility: "توافق الفصائل",
      nav_eligibility: "اختبار الأهلية",
      nav_campaigns: "الحملات",
      nav_gallery: "معرض الأنشطة",
      nav_partners: "شركاؤنا",
      nav_register: "انضم إلينا",
      nav_contact: "اتصل بنا",
      nav_more: "المزيد",
      cta_donate: "تبرع الآن",
      dark_mode_label: "الوضع الليلي",
      lang_ar: "العربية",
      lang_fr: "Français",

      // Gallery & Partners Section
      gallery_title: "معرض الأنشطة والحملات",
      gallery_subtitle: "توثيق مصور لأبرز حملات وقوافل التبرع بالدم والأنشطة التحسيسية بإقليم بركان",
      gallery_tag_all: "الكل",
      gallery_tag_campaign: "حملات التبرع",
      gallery_tag_caravan: "قوافل متنقلة",
      gallery_tag_awareness: "توعية وتحسيس",
      partners_title: "الشركاء والداعمين",
      partners_subtitle: "نعمل بتكامل وثيق مع مختلف الفاعلين المؤسساتيين والصحيين والجمعويين لإنقاذ الأرواح",

      // Hero Section
      hero_title: "كل قطرة دم تصنع الفارق",
      hero_subtitle: "جمعية المتبرعين بالدم بإقليم بركان في خدمة الإنسانية منذ 2011",
      hero_cta_register: "سجل كمتبرع",
      hero_cta_eligibility: "اختبر أهليتك",

      // Stats Cards
      stat_donors: "المتبرعون المسجلون",
      stat_bags: "أكياس الدم المجمعة",
      stat_campaigns: "حملات التبرع",
      stat_lives: "الأرواح المنقذة",

      // About Section
      about_title: "من نحن",
      about_p1: "تأسست جمعية المتبرعين بالدم بإقليم بركان سنة 2011 وفق مقتضيات الظهير الشريف المنظم للعمل الجمعوي بالمغرب، نكرس جهودنا الإنسانية والتطوعية لترسيخ ثقافة التبرع المنتظم بالدم وتوعية مختلف فئات المجتمع بالجهة الشرقية بأهمية هذا العمل النبيل لإنقاذ أرواح المرضى والمصابين.",
      about_p2: "تتمثل مهمتنا الأساسية في تنظيم حملات دورية ومتحركة للتبرع بالدم بتنسيق وثيق مع الوكالة المغربية للدم ومشتقاته والمؤسسات العمومية والجمعوية، إضافة إلى إدارة قاعدة بيانات رقمية آمنة للمتبرعين للاستجابة الفورية لكافة الحالات الاستعجالية والطارئة بمستشفيات الإقليم.",
      about_feat1_title: "شراكات مؤسساتية",
      about_feat1_desc: "شراكات فاعلة مع الوكالة المغربية للدم ومشتقاته والمؤسسات الصحية والجمعوية بالجهة الشرقية.",
      about_feat2_title: "توعية وتحسيس",
      about_feat2_desc: "أنشطة تحسيسية مستمرة لنشر ثقافة التبرع الطوعي بالدم بين مختلف فئات المجتمع.",
      about_feat3_title: "حملات متنقلة",
      about_feat3_desc: "تنظيم حملات للتبرع بالدم في مختلف مناطق إقليم بركان .",

      // Blood Compatibility Section
      compat_title: "جدول توافق فصائل الدم",
      compat_subtitle: "اختر فصيلة دمك لمعرفة من يمكنك التبرع له ومن يمكنه التبرع لك",
      compat_donate_to: "يمكنه التبرع لـ",
      compat_receive_from: "يمكنه الاستفادة من",
      compat_select_prompt: "اختر فصيلة دم أعلاه",
      blood_all: "الكل",

      // Eligibility Quiz Section
      elig_title: "اختبار أهلية التبرع",
      elig_subtitle: "أجب على الأسئلة التالية لمعرفة مدى أهليتك للتبرع بالدم",
      elig_q1: "هل عمرك بين 18 و 60 سنة؟",
      elig_q2: "هل يتجاوز وزنك 50 كيلوغراماً؟",
      elig_q3: "هل مضت مدة كافية منذ آخر تبرع (شهران للرجال، 3 أشهر للنساء)؟",
      elig_q4: "هل أنت بصحة جيدة ولم تخضع لعملية جراحية في آخر 6 أشهر؟",
      elig_q5: "هل تعلم أن الفحص الطبي القبلي من طرف طبيب الحملة إلزامي قبل كل تبرع؟",
      elig_yes: "نعم",
      elig_no: "لا",
      elig_next: "التالي",
      elig_prev: "السابق",
      elig_result_pass: "🎉 تهانينا! يبدو أنك مؤهل للتبرع بالدم. لا تنسَ أن الفحص الطبي النهائي يتم يوم الحملة.",
      elig_result_fail: "⚠️ للأسف، بناءً على إجاباتك، قد لا تكون مؤهلاً حالياً للتبرع. استشر طبيبك للمزيد من المعلومات.",
      elig_restart: "إعادة الاختبار",
      elig_step: "السؤال",
      elig_of: "من",

      // Campaign Countdown Section
      campaign_title: "الحملة القادمة",
      campaign_name: "لا توجد حملة معلنة حاليًا",
      campaign_location: "",
      campaign_date: "",
      countdown_days: "يوم",
      countdown_hours: "ساعة",
      countdown_minutes: "دقيقة",
      countdown_seconds: "ثانية",

      // Donor Journey Section
      journey_title: "مراحل التبرع",
      journey_step1_title: "الاستقبال والفحص الطبي القبلي",
      journey_step1_desc: "يستقبلك فريقنا ويقوم الطبيب المختص بفحص طبي شامل للتأكد من أهليتك.",
      journey_step2_title: "التسجيل في المنظومة الرقمية",
      journey_step2_desc: "يتم تسجيل بياناتك بشكل آمن في المنظومة الرقمية الوطنية لنقل الدم.",
      journey_step3_title: "التبرع بالدم الآمن",
      journey_step3_desc: "عملية التبرع تستغرق حوالي 10 دقائق فقط في ظروف صحية آمنة تماماً.",
      journey_step4_title: "الاستراحة والوجبة الخفيفة",
      journey_step4_desc: "بعد التبرع، استرح قليلاً واستمتع بوجبة خفيفة ومشروبات مقدمة من الجمعية.",

      // Registration Forms Section
      register_title: "انضم إلينا",
      tab_donor: "التسجيل كمتبرع",
      tab_volunteer: "التطوع معنا",

      // Donor form fields
      form_fullname: "الاسم الكامل",
      form_phone: "رقم الهاتف",
      form_blood_group: "فصيلة الدم",
      form_blood_select: "اختر فصيلة الدم",
      form_blood_unknown: "لا أعرف فصيلة دمي",
      form_district: "الحي / الجماعة (إقليم بركان)",
      form_district_label: "الحي / الجماعة",
      form_consent: "أوافق على معالجة بياناتي الشخصية وفقاً للقانون المغربي 09-08 المتعلق بحماية المعطيات ذات الطابع الشخصي",
      form_submit_donor: "تسجيل",

      // Volunteer form fields
      vol_fullname: "الاسم الكامل",
      vol_phone: "رقم الهاتف",
      vol_area: "مجال المساهمة",
      vol_area_select: "اختر مجال المساهمة",
      vol_area_logistics: "التنظيم واللوجستيك",
      vol_area_comm: "التواصل والإعلام",
      vol_area_medical: "الطاقم التقني",
      vol_area_awareness: "التوعية والتحسيس",
      form_submit_volunteer: "إرسال الطلب",

      // Footer
      footer_about_title: "عن الجمعية",
      footer_about_text: "جمعية المتبرعين بالدم بإقليم بركان، جمعية غير ربحية مؤسسة سنة 2011، تعمل على نشر ثقافة التبرع بالدم وإنقاذ الأرواح بالجهة الشرقية وفي ربوع المملكة المغربية.",
      footer_links_title: "روابط سريعة",
      footer_contact_title: "تواصل معنا",
      footer_address: "بركان، إقليم بركان، الجهة الشرقية، المغرب",
      footer_copyright: "© 2026 جمعية المتبرعين بالدم بإقليم بركان. جميع الحقوق محفوظة.",

      // Leaderboard / Teams Challenge
      nav_leaderboard: "تحدي الفرق",
      leaderboard_title: "تحدي المؤسسات والفرق ببركان",
      leaderboard_subtitle: "لوحة شرف أنشط الجمعيات، المؤسسات، والمجموعات المساهمة في إنقاذ الأرواح بالإقليم",
      leaderboard_btn_pledge: "سجل فريقك أو مؤسستك في التحدي",
      leaderboard_rank: "المرتبة",
      leaderboard_bags: "كيس دم",
      leaderboard_goal: "الهدف",
      leaderboard_completed: "مكتمل",
      leaderboard_empty: "لا توجد فرق مسجلة في لوحة الشرف حالياً. كن أول من يسجل فريقه في التحدي!",
      leaderboard_modal_title: "تسجيل فريق أو مؤسسة في التحدي",
      leaderboard_modal_subtitle: "ساهم مع زملائك أو أعضاء جمعيتك في إنقاذ الأرواح وتصدر لوحة الشرف بإقليم بركان",
      leaderboard_team_name: "اسم الفريق أو المؤسسة *",
      leaderboard_category: "نوع المؤسسة / الفريق *",
      leaderboard_cat_education: "مؤسسة تعليمية / جامعية",
      leaderboard_cat_association: "جمعية / منظمة مجتمع مدني",
      leaderboard_cat_company: "شركة / مقاولة خاصة",
      leaderboard_cat_youth: "نادي رياضي / فريق شبابي",
      leaderboard_cat_public: "إدارة / مؤسسة عمومية",
      leaderboard_cat_other: "مجموعة أخرى",
      leaderboard_coordinator: "اسم منسق(ة) الفريق *",
      leaderboard_phone: "رقم هاتف المنسق *",
      leaderboard_target: "الهدف المتوقع (عدد أكياس الدم) *",
      leaderboard_notes: "ملاحظات أو رسالة إضافية (اختياري)",
      leaderboard_submit: "إرسال طلب التسجيل",
      toast_team_success: "✅ شكراً لك! تم إرسال طلب تسجيل فريقك بنجاح وسيتواصل معكم فريق الجمعية قريباً.",

      // Recovery Simulator
      nav_recovery: "محاكي التعافي",
      recovery_badge: "رحلة التجدد الحيوي داخل جسمك",
      recovery_title: "ماذا يحدث في جسمك بعد التبرع بالدم؟",
      recovery_subtitle: "تابع المحاكاة العلمية الدقيقة لتعويض السوائل، تجدد الخلايا، ومسار كيس دمك بالمستشفى",
      recovery_stage_1: "بعد 15 دقيقة",
      recovery_stage_2: "بعد 24 - 48 ساعة",
      recovery_stage_3: "بعد 3 - 5 أيام",
      recovery_stage_4: "بعد 4 - 6 أسابيع",
      recovery_stage_5: "بعد 8 أسابيع 🏆",
      recovery_metric_plasma: "تعويض البلازما والسوائل",
      recovery_metric_platelets: "تجدد الصفائح الدموية",
      recovery_metric_rbc: "بناء الكريات الحمراء الجديدة",
      recovery_bag_title: "مسار كيس دمك بالمستشفى🏥",
      recovery_doctor_tip_title: "نصيحة طبيب الحملة",
      recovery_calc_title: "حاسبة تعافيك وموعد تبرعك القادم",
      recovery_calc_subtitle: "أدخل تاريخ آخر تبرع لك بالدم لمعرفة مرحلتك الحالية فوراً وتاريخ تبرعك القادم المسموح به طبياً",
      recovery_calc_btn: "افحص حالتي الآن",
      recovery_calc_placeholder: "اختر تاريخ آخر تبرع",
      recovery_overall_label: "نسبة التعافي الإجمالية",

      // Toast Notifications
      toast_donor_success: "✅ شكراً لك! تم تسجيلك بنجاح كمتبرع بالدم.",
      toast_volunteer_success: "✅ شكراً لك! تم إرسال طلب التطوع بنجاح.",
      toast_form_error: "❌ يرجى ملء جميع الحقول المطلوبة."
    },

    fr: {
      resources_title: "Questions et informations",
      resources_subtitle: "Des repères pour comprendre l’inscription et le don de sang.",
      resources_faq_title: "Questions fréquentes",
      resources_faq_description: "Inscription, confidentialité et utilisation du site",
      resources_facts_title: "Don de sang : questions et vérités",
      resources_facts_description: "Comprendre le don et les idées reçues",
      resources_back: "Retour à l’accueil",
      registration_success_donor_title: "Votre demande de don a bien été reçue",
      registration_success_volunteer_title: "Votre demande de bénévolat a bien été reçue",
      registration_success_team_title: "La demande d’inscription de votre équipe a bien été reçue",
      registration_success_description: "Merci pour votre initiative. L’administration de l’association examinera les informations transmises et vous contactera si nécessaire pour organiser votre participation. Il n’est pas nécessaire de renvoyer votre demande.",
      registration_success_acknowledge: "J’ai compris",
      privacy_link: "Politique de confidentialité",
      privacy_back: "Retour au site",
      // Logo & Badge
      nav_logo_text: "Donneurs Berkane",
      hero_badge: "Association des Donneurs de Sang — Province de Berkane",

      // Emergency Banner
      emergency_text: "",
      emergency_btn: "Détails de l'appel",

      // Navbar
      nav_home: "Accueil",
      nav_about: "À propos",
      nav_compatibility: "Compatibilité",
      nav_eligibility: "Éligibilité",
      nav_campaigns: "Campagnes",
      nav_gallery: "Galerie",
      nav_partners: "Partenaires",
      nav_register: "Rejoignez-nous",
      nav_contact: "Contact",
      nav_more: "Plus",
      cta_donate: "Donner maintenant",
      dark_mode_label: "Mode sombre",
      lang_ar: "العربية",
      lang_fr: "Français",

      // Gallery & Partners Section
      gallery_title: "Galerie des Activités & Campagnes",
      gallery_subtitle: "Rétrospective photographique des campagnes de don de sang et actions de sensibilisation dans la province de Berkane",
      gallery_tag_all: "Tous",
      gallery_tag_campaign: "Campagnes",
      gallery_tag_caravan: "Caravanes",
      gallery_tag_awareness: "Sensibilisation",
      partners_title: "Nos Partenaires & Soutiens",
      partners_subtitle: "En étroite collaboration avec les acteurs institutionnels, médicaux et associatifs pour sauver des vies",

      // Hero Section
      hero_title: "Chaque goutte de sang fait la différence",
      hero_subtitle: "L'Association des Donneurs de Sang de la Province de Berkane au service de l'humanité depuis 2011",
      hero_cta_register: "Devenir Donneur",
      hero_cta_eligibility: "Tester mon éligibilité",

      // Stats Cards
      stat_donors: "Donneurs Inscrits",
      stat_bags: "Poches Collectées",
      stat_campaigns: "Campagnes Organisées",
      stat_lives: "Vies Sauvées",

      // About Section
      about_title: "Qui sommes-nous",
      about_p1: "Fondée en 2011 sous le régime des associations au Maroc, l'Association des Donneurs de Sang de la Province de Berkane œuvre bénévolement pour promouvoir la culture du don régulier et volontaire, Nous sensibilisons activement toutes les composantes de la société dans la province de Berkane et la région de l'Oriental à la portée vitale de cet acte civique et solidaire.",
      about_p2: "Notre mission centrale s'articule autour de l'organisation régulière de campagnes de collecte mobiles en étroite collaboration avec l'Agence Marocaine du Sang et de ses Dérivés et ainsi que les établissements publics et associatifs. Nous gérons également un fichier numérique de donneurs volontaires pour répondre avec diligence et efficacité à toute urgence vitale.",
      about_feat1_title: "Partenariats institutionnels",
      about_feat1_desc: "Partenariats actifs avec l'Agence Marocaine du Sang et de ses Dérivés et les établissements publique et associatifs de la région de l'Oriental.",
      about_feat2_title: "Sensibilisation",
      about_feat2_desc: "Activités de sensibilisation continues pour promouvoir la culture du don volontaire de sang auprès de toutes les catégories de la société.",
      about_feat3_title: "Campagnes mobiles",
      about_feat3_desc: "Organisation de campagnes de don de sang dans les différentes zones de la province de Berkane en coordination avec les hôpitaux et centres de santé.",

      // Blood Compatibility Section
      compat_title: "Compatibilité des Groupes Sanguins",
      compat_subtitle: "Sélectionnez votre groupe sanguin pour découvrir les compatibilités",
      compat_donate_to: "Peut donner à",
      compat_receive_from: "Peut recevoir de",
      compat_select_prompt: "Sélectionnez un groupe sanguin ci-dessus",
      blood_all: "Tous",

      // Eligibility Quiz Section
      elig_title: "Test d'Éligibilité au Don",
      elig_subtitle: "Répondez aux questions suivantes pour vérifier votre éligibilité au don de sang",
      elig_q1: "Avez-vous entre 18 et 60 ans ?",
      elig_q2: "Pesez-vous plus de 50 kg ?",
      elig_q3: "Le délai depuis votre dernier don est-il suffisant (2 mois pour les hommes, 3 mois pour les femmes) ?",
      elig_q4: "Êtes-vous en bonne santé et n'avez-vous pas subi de chirurgie au cours des 6 derniers mois ?",
      elig_q5: "Savez-vous qu'un examen médical préalable par le médecin de la campagne est obligatoire avant chaque don ?",
      elig_yes: "Oui",
      elig_no: "Non",
      elig_next: "Suivant",
      elig_prev: "Précédent",
      elig_result_pass: "🎉 Félicitations ! Vous semblez éligible au don de sang. N'oubliez pas que l'examen médical final sera effectué le jour de la campagne.",
      elig_result_fail: "⚠️ Malheureusement, d'après vos réponses, vous pourriez ne pas être éligible actuellement. Consultez votre médecin pour plus d'informations.",
      elig_restart: "Recommencer le test",
      elig_step: "Question",
      elig_of: "sur",

      // Campaign Countdown Section
      campaign_title: "Prochaine Campagne",
      campaign_name: "Aucune campagne annoncée pour le moment",
      campaign_location: "",
      campaign_date: "",
      countdown_days: "Jours",
      countdown_hours: "Heures",
      countdown_minutes: "Minutes",
      countdown_seconds: "Secondes",

      // Donor Journey Section
      journey_title: "Parcours du Donneur",
      journey_step1_title: "Accueil & Examen médical préalable",
      journey_step1_desc: "Notre équipe vous accueille et le médecin effectue un examen médical complet pour vérifier votre éligibilité.",
      journey_step2_title: "Inscription numérique",
      journey_step2_desc: "Vos données sont enregistrées de manière sécurisée dans le système numérique national de transfusion sanguine.",
      journey_step3_title: "Don de sang sécurisé",
      journey_step3_desc: "Le don dure environ 10 minutes dans des conditions sanitaires totalement sûres.",
      journey_step4_title: "Repos & Collation",
      journey_step4_desc: "Après le don, reposez-vous et profitez d'une collation et de boissons offertes par l'association.",

      // Registration Forms Section
      register_title: "Rejoignez-nous",
      tab_donor: "S'inscrire comme Donneur",
      tab_volunteer: "Devenir Bénévole",

      // Donor form fields
      form_fullname: "Nom complet",
      form_phone: "Numéro de téléphone",
      form_blood_group: "Groupe sanguin",
      form_blood_select: "Sélectionnez votre groupe sanguin",
      form_blood_unknown: "Je ne connais pas mon groupe sanguin",
      form_district: "Quartier / Commune (Province de Berkane)",
      form_district_label: "Quartier / Commune",
      form_consent: "J'accepte le traitement de mes données personnelles conformément à la loi marocaine 09-08 relative à la protection des données à caractère personnel",
      form_submit_donor: "S'inscrire",

      // Volunteer form fields
      vol_fullname: "Nom complet",
      vol_phone: "Numéro de téléphone",
      vol_area: "Domaine de contribution",
      vol_area_select: "Choisissez votre domaine",
      vol_area_logistics: "Organisation & Logistique",
      vol_area_comm: "Communication & Médias",
      vol_area_medical: "Le staff technique",
      vol_area_awareness: "Sensibilisation",
      form_submit_volunteer: "Envoyer la demande",

      // Footer
      footer_about_title: "À propos",
      footer_about_text: "L'Association des Donneurs de Sang de la Province de Berkane, fondée en 2011, œuvre pour promouvoir la culture du don de sang et sauver des vies dans la région de l'Oriental et à travers tout le Royaume du Maroc.",
      footer_links_title: "Liens rapides",
      footer_contact_title: "Contactez-nous",
      footer_address: "Berkane, Province de Berkane, Région de l'Oriental, Maroc",
      footer_copyright: "© 2026 Association des Donneurs de Sang de la Province de Berkane. Tous droits réservés.",

      // Leaderboard / Teams Challenge
      nav_leaderboard: "Défi des Équipes",
      leaderboard_title: "Défi des Équipes & Institutions de Berkane",
      leaderboard_subtitle: "Tableau d'honneur des groupes, écoles et organisations les plus actifs dans le don de sang",
      leaderboard_btn_pledge: "Inscrire votre équipe ou institution",
      leaderboard_rank: "Rang",
      leaderboard_bags: "poches",
      leaderboard_goal: "Objectif",
      leaderboard_completed: "atteint",
      leaderboard_empty: "Aucune équipe n'est encore inscrite au tableau d'honneur. Soyez les premiers à participer !",
      leaderboard_modal_title: "Inscrire une équipe ou institution",
      leaderboard_modal_subtitle: "Rejoignez le défi avec vos collègues ou membres et menez le tableau d'honneur à Berkane",
      leaderboard_team_name: "Nom de l'équipe ou institution *",
      leaderboard_category: "Type d'organisation *",
      leaderboard_cat_education: "Établissement éducatif / Scolaire",
      leaderboard_cat_association: "Association / Société civile",
      leaderboard_cat_company: "Entreprise / Secteur privé",
      leaderboard_cat_youth: "Club sportif / Groupe de jeunes",
      leaderboard_cat_public: "Administration / Établissement public",
      leaderboard_cat_other: "Autre groupe",
      leaderboard_coordinator: "Nom du coordinateur / coordinatrice *",
      leaderboard_phone: "Numéro de téléphone du coordinateur *",
      leaderboard_target: "Objectif prévu (nombre de poches) *",
      leaderboard_notes: "Remarques ou message (facultatif)",
      leaderboard_submit: "Envoyer la candidature",
      toast_team_success: "✅ Merci ! Votre demande d'inscription a été envoyée avec succès. Nous vous contacterons bientôt.",

      // Recovery Simulator
      nav_recovery: "Simulateur de récupération",
      recovery_badge: "Régénération biologique après le don",
      recovery_title: "Que se passe-t-il dans votre corps après un don ?",
      recovery_subtitle: "Suivez la simulation biologique précise du renouvellement cellulaire et du parcours de votre poche à l'Hôpital",
      recovery_stage_1: "Après 15 min",
      recovery_stage_2: "Après 24 - 48h",
      recovery_stage_3: "Après 3 - 5 jours",
      recovery_stage_4: "Après 4 - 6 sem.",
      recovery_stage_5: "Après 8 sem. 🏆",
      recovery_metric_plasma: "Volume du Plasma & Fluides",
      recovery_metric_platelets: "Régénération des Plaquettes",
      recovery_metric_rbc: "Nouveaux Globules Rouges",
      recovery_bag_title: "Parcours de votre poche à l'Hôpital 🏥",
      recovery_doctor_tip_title: "Conseil médical du médecin",
      recovery_calc_title: "Calculateur de récupération & Prochain don",
      recovery_calc_subtitle: "Entrez la date de votre dernier don pour connaître votre stade actuel et votre prochaine date d'éligibilité",
      recovery_calc_btn: "Vérifier mon état",
      recovery_calc_placeholder: "Date du dernier don",
      recovery_overall_label: "Régénération Globale",

      // Toast Notifications
      toast_donor_success: "✅ Merci ! Vous êtes inscrit(e) avec succès comme donneur de sang.",
      toast_volunteer_success: "✅ Merci ! Votre demande de bénévolat a été envoyée avec succès.",
      toast_form_error: "❌ Veuillez remplir tous les champs obligatoires."
    }
  };

  /**
   * Get the current active language
   * @returns {string} 'ar' or 'fr'
   */
  function getCurrentLang() {
    var htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang === 'fr' || htmlLang === 'ar') {
      return htmlLang;
    }
    try {
      var stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('preferred_language');
      if (stored === 'fr' || stored === 'ar') {
        return stored;
      }
    } catch (e) {
      // localStorage might be unavailable or disabled
    }
    return 'ar';
  }

  /**
   * Translate a single key for a given language
   * @param {string} key 
   * @param {string} [lang] 
   * @returns {string}
   */
  function t(key, lang) {
    var current = lang || getCurrentLang();
    if (translations[current] && translations[current][key] !== undefined) {
      return translations[current][key];
    }
    // Fallback to Arabic if missing in French
    if (translations.ar && translations.ar[key] !== undefined) {
      return translations.ar[key];
    }
    return key;
  }

  /**
   * Switch and apply language to the whole page
   * @param {string} lang - 'ar' or 'fr'
   */
  function setLanguage(lang) {
    if (lang !== 'ar' && lang !== 'fr') {
      lang = 'ar';
    }

    var isRTL = (lang === 'ar');
    var dir = isRTL ? 'rtl' : 'ltr';

    // 1. Set <html> lang and dir attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);

    // 2. Switch Google Font
    // Arabic uses 'Cairo', French uses 'Plus Jakarta Sans'
    var primaryFont = isRTL ? "'Cairo', sans-serif" : "'Plus Jakarta Sans', sans-serif";
    document.documentElement.style.setProperty('--font-primary', primaryFont);
    document.documentElement.style.setProperty('--font-main', primaryFont);
    if (document.body) {
      document.body.style.fontFamily = primaryFont;
      if (isRTL) {
        document.body.classList.remove('font-fr', 'lang-fr');
        document.body.classList.add('font-ar', 'lang-ar');
      } else {
        document.body.classList.remove('font-ar', 'lang-ar');
        document.body.classList.add('font-fr', 'lang-fr');
      }
    }

    var dict = translations[lang] || translations.ar;

    // 3. Update all elements with data-i18n attribute (textContent)
    var textElements = document.querySelectorAll('[data-i18n]');
    textElements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key && dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 4. Update all elements with data-i18n-placeholder attribute (placeholder)
    var placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key && dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Supportive: update data-i18n-title and data-i18n-aria-label if present
    var titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (key && dict[key] !== undefined) {
        el.setAttribute('title', dict[key]);
      }
    });

    var ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
    ariaElements.forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (key && dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key]);
      }
    });

    // 5. Update active state on language switcher buttons
    var langButtons = document.querySelectorAll('[data-lang], [data-set-lang], .lang-btn, .lang-option');
    langButtons.forEach(function (btn) {
      var btnLang = btn.getAttribute('data-lang') || btn.getAttribute('data-set-lang');
      if (btnLang) {
        var isActive = (btnLang === lang);
        if (isActive) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          btn.setAttribute('aria-current', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
          btn.removeAttribute('aria-current');
        }
      }
    });

    // 6. Save preference to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem('preferred_language', lang);
    } catch (e) {
      console.warn('localStorage is not available for saving language preference:', e);
    }

    // 7. Dispatch custom 'languageChanged' event on document & window
    var langEvent = new CustomEvent('languageChanged', {
      detail: {
        lang: lang,
        dir: dir,
        isRTL: isRTL,
        font: primaryFont
      },
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(langEvent);
    window.dispatchEvent(langEvent);
  }

  /**
   * Auto-initialize on DOMContentLoaded or immediately if DOM is ready
   */
  function init() {
    var savedLang = 'ar';
    try {
      var stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('preferred_language');
      if (stored === 'ar' || stored === 'fr') {
        savedLang = stored;
      }
    } catch (e) {
      // ignore
    }

    setLanguage(savedLang);

    // Global click listener for any language switch buttons
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-lang], [data-set-lang]');
      if (target) {
        var targetLang = target.getAttribute('data-lang') || target.getAttribute('data-set-lang');
        if (targetLang === 'ar' || targetLang === 'fr') {
          e.preventDefault();
          setLanguage(targetLang);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global Exports
  window.translations = translations;
  window.setLanguage = setLanguage;
  window.getCurrentLang = getCurrentLang;
  window.t = t;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      translations: translations,
      setLanguage: setLanguage,
      getCurrentLang: getCurrentLang,
      t: t
    };
  }
})();
