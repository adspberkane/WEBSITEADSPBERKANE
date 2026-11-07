(function () {
  'use strict';
  const copy = {
    ar: {
      intro: 'إجابات واضحة حول التسجيل، خصوصيتك وطرق المشاركة مع الجمعية.',
      searchLabel: 'البحث في الأسئلة والأجوبة', placeholder: 'ابحث عن سؤالك…', browse: 'تصفّح حسب الموضوع',
      categoriesLabel: 'مواضيع الأسئلة الشائعة', all: 'الكل', registration: 'التسجيل', privacy: 'الخصوصية', participation: 'المشاركة',
      count: 'عدد الأسئلة المعروضة: ', emptyTitle: 'لم نعثر على سؤال مطابق', emptyDescription: 'جرّب كلمات أخرى أو اعرض جميع الأسئلة.', reset: 'عرض جميع الأسئلة',
      registerLink: 'الانتقال إلى التسجيل', privacyLink: 'قراءة سياسة الخصوصية', teamsLink: 'تسجيل فريق أو مؤسسة', phoneLink: '+212 677 216 964'
    },
    fr: {
      intro: 'Des réponses claires sur l’inscription, votre confidentialité et les façons de participer.',
      searchLabel: 'Rechercher dans les questions et réponses', placeholder: 'Recherchez votre question…', browse: 'Parcourir par sujet',
      categoriesLabel: 'Sujets des questions fréquentes', all: 'Tout', registration: 'Inscription', privacy: 'Confidentialité', participation: 'Participation',
      count: 'Questions affichées : ', emptyTitle: 'Aucune question correspondante', emptyDescription: 'Essayez d’autres mots ou affichez toutes les questions.', reset: 'Afficher toutes les questions',
      registerLink: 'Accéder à l’inscription', privacyLink: 'Lire la politique de confidentialité', teamsLink: 'Inscrire une équipe ou institution', phoneLink: '+212 677 216 964'
    }
  };
  const questions = [
    { id: 'register', category: 'registration',
      ar: ['كيف أسجّل كمتبرع بالدم؟', 'من قسم «انضم إلينا» في الصفحة الرئيسية، اختر «التسجيل كمتبرع»، وأدخل اسمك ورقم هاتفك وفصيلة دمك والحي أو الجماعة. وافق على معالجة بياناتك الشخصية، ثم اضغط «تسجيل». ستظهر نافذة تأكيد بعد حفظ طلبك بنجاح.'],
      fr: ['Comment m’inscrire comme donneur de sang ?', 'Dans la rubrique « Rejoignez-nous » de la page d’accueil, choisissez « S’inscrire comme Donneur ». Renseignez votre nom, téléphone, groupe sanguin et quartier ou commune, puis acceptez le traitement de vos données et envoyez le formulaire. Une fenêtre de confirmation apparaît une fois la demande enregistrée.'],
      links: [['index.html#register', 'registerLink']] },
    { id: 'blood-group', category: 'registration',
      ar: ['هل يمكنني التسجيل إذا لم أعرف فصيلة دمي؟', 'نعم. اختر «لا أعرف فصيلة دمي» في قائمة فصائل الدم، ثم أكمل التسجيل. لا تحتاج إلى تخمين فصيلتك لإرسال الطلب.'],
      fr: ['Puis-je m’inscrire sans connaître mon groupe sanguin ?', 'Oui. Choisissez « Je ne connais pas mon groupe sanguin » dans la liste, puis complétez votre inscription. Vous n’avez pas besoin de deviner votre groupe pour envoyer la demande.'],
      links: [['index.html#register', 'registerLink']] },
    { id: 'after-submission', category: 'registration',
      ar: ['ماذا يحدث بعد إرسال طلبي؟', 'بعد حفظ الطلب بنجاح، تظهر نافذة تؤكد استلامه. ستراجع إدارة الجمعية المعلومات التي أرسلتها وتتواصل معك عند الحاجة لتنسيق مشاركتك. لا تعني رسالة الاستلام أن موعداً للتبرع قد حُجز تلقائياً.'],
      fr: ['Que se passe-t-il après l’envoi de ma demande ?', 'Une fois la demande enregistrée, une fenêtre confirme sa réception. L’administration de l’association examinera vos informations et vous contactera si nécessaire pour organiser votre participation. Cette confirmation ne constitue pas une réservation automatique de rendez-vous.'] },
    { id: 'repeat-registration', category: 'registration',
      ar: ['هل أحتاج إلى إعادة التسجيل بعد ظهور التأكيد؟', 'لا. ظهور نافذة التأكيد يعني أن طلبك قد حُفظ، ولا حاجة إلى إرساله مرة أخرى. إذا رغبت في تصحيح معلومات أرسلتها، تواصل مع الجمعية بدلاً من إنشاء طلب مكرر.'],
      fr: ['Dois-je me réinscrire après la confirmation ?', 'Non. La fenêtre de confirmation indique que votre demande a été enregistrée : il n’est pas nécessaire de la renvoyer. Pour corriger des informations déjà transmises, contactez l’association plutôt que d’envoyer une nouvelle demande.'] },
    { id: 'public-information', category: 'privacy',
      ar: ['هل تظهر معلوماتي الشخصية للعموم؟', 'لا تُنشر المعلومات الشخصية التي تقدمها في استمارات التسجيل للعموم. وهي مخصصة لإدارة الجمعية والأشخاص المخولين لديها لمعالجة الطلبات وتنسيق المشاركة. يمكنك الاطلاع على التفاصيل في سياسة الخصوصية.'],
      fr: ['Mes données personnelles sont-elles publiques ?', 'Les données personnelles transmises par les formulaires d’inscription ne sont pas publiées. Elles sont destinées à l’administration de l’association et aux personnes habilitées pour traiter les demandes et coordonner la participation. Consultez la politique de confidentialité pour en savoir plus.'],
      links: [['privacy.html', 'privacyLink']] },
    { id: 'correct-delete', category: 'privacy',
      ar: ['كيف أطلب تصحيح معلوماتي أو حذفها؟', 'يمكنك التواصل مع الجمعية على الرقم أدناه لطلب تصحيح معلوماتك أو حذفها. قد نطلب منك معلومات محدودة للتحقق من هويتك وحماية بياناتك. تُوضح سياسة الخصوصية كيفية التعامل مع هذه الطلبات.'],
      fr: ['Comment demander la rectification ou la suppression de mes données ?', 'Contactez l’association au numéro ci-dessous pour demander la rectification ou la suppression de vos données. Des informations limitées peuvent être demandées pour vérifier votre identité et protéger vos données. La politique de confidentialité précise le traitement de ces demandes.'],
      links: [['tel:+212677216964', 'phoneLink'], ['privacy.html', 'privacyLink']] },
    { id: 'volunteer-team', category: 'participation',
      ar: ['كيف أسجّل كمتطوع أو أسجّل فريقي؟', 'للتطوع، افتح قسم «انضم إلينا» واختر «التطوع معنا»، ثم أدخل اسمك ورقم هاتفك ومجال المساهمة. لتسجيل فريق أو مؤسسة، افتح قسم «تحدي المؤسسات والفرق ببركان» واضغط زر تسجيل الفريق، ثم أكمل الاستمارة. يظهر التأكيد بعد حفظ الطلب بنجاح.'],
      fr: ['Comment devenir bénévole ou inscrire mon équipe ?', 'Pour devenir bénévole, ouvrez « Rejoignez-nous », puis « Devenir Bénévole » et indiquez votre nom, téléphone et domaine de participation. Pour une équipe ou institution, ouvrez le « Défi des Équipes & Institutions de Berkane » et remplissez le formulaire d’inscription. La confirmation apparaît une fois la demande enregistrée.'],
      links: [['index.html#register', 'registerLink'], ['index.html#teams-leaderboard', 'teamsLink']] }
  ];
  function normalize(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function init() {
    const list = document.getElementById('faq-list');
    if (!list) return;
    const search = document.getElementById('faq-search'), categories = document.getElementById('faq-categories');
    const categoryIds = ['all', 'registration', 'privacy', 'participation'];
    let category = 'all', openId = null;
    const lang = () => document.documentElement.lang === 'fr' ? 'fr' : 'ar';
    function setOpen(id) {
      openId = id;
      list.querySelectorAll('.faq-item').forEach(item => {
        const open = item.dataset.questionId === id && !item.hidden;
        item.classList.toggle('is-open', open);
        item.querySelector('button').setAttribute('aria-expanded', String(open));
        const panel = item.querySelector('.faq-panel');
        panel.setAttribute('aria-hidden', String(!open));
        panel.inert = !open;
      });
    }
    function filter() {
      const words = normalize(search.value).split(' ').filter(Boolean);
      const matches = questions.filter(q => {
        const text = normalize(q.ar.join(' ') + ' ' + q.fr.join(' '));
        return words.every(word => text.includes(word));
      });
      let visible = 0;
      list.querySelectorAll('.faq-item').forEach(item => {
        const question = matches.find(q => q.id === item.dataset.questionId);
        item.hidden = !question || (category !== 'all' && question.category !== category);
        if (!item.hidden) visible++;
        else if (openId === item.dataset.questionId) openId = null;
      });
      categories.querySelectorAll('button').forEach(button => {
        const id = button.dataset.category;
        button.setAttribute('aria-pressed', String(id === category));
        button.querySelector('.faq-category-count').textContent = matches.filter(q => id === 'all' || q.category === id).length;
      });
      document.getElementById('faq-result-count').textContent = copy[lang()].count + visible;
      document.getElementById('faq-empty').hidden = visible > 0;
      setOpen(openId);
    }
    function render() {
      const locale = lang(), text = copy[locale];
      document.querySelectorAll('[data-faq-text]').forEach(el => { el.textContent = text[el.dataset.faqText]; });
      search.placeholder = text.placeholder;
      categories.setAttribute('aria-label', text.categoriesLabel);
      categories.replaceChildren();
      categoryIds.forEach(id => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'faq-category'; button.dataset.category = id;
        button.setAttribute('aria-controls', 'faq-list');
        const label = document.createElement('span'), count = document.createElement('span');
        label.textContent = text[id]; count.className = 'faq-category-count'; count.setAttribute('aria-hidden', 'true');
        button.append(label, count);
        button.addEventListener('click', () => { category = id; filter(); });
        categories.append(button);
      });
      list.replaceChildren();
      questions.forEach((q, index) => {
        const item = document.createElement('article');
        item.className = 'faq-item'; item.dataset.questionId = q.id;
        const heading = document.createElement('h2'), button = document.createElement('button');
        button.type = 'button'; button.className = 'faq-question'; button.id = `faq-question-${q.id}`;
        button.setAttribute('aria-controls', `faq-answer-${q.id}`);
        const number = document.createElement('span'), title = document.createElement('span'), toggle = document.createElement('span');
        number.className = 'faq-number'; number.textContent = String(index + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
        title.className = 'faq-question-text'; title.textContent = q[locale][0];
        toggle.className = 'faq-toggle'; toggle.setAttribute('aria-hidden', 'true');
        button.append(number, title, toggle); heading.append(button);
        const panel = document.createElement('div'), inner = document.createElement('div'), answer = document.createElement('div'), paragraph = document.createElement('p');
        panel.className = 'faq-panel'; panel.id = `faq-answer-${q.id}`; panel.setAttribute('role', 'region'); panel.setAttribute('aria-labelledby', button.id);
        inner.className = 'faq-panel-inner'; answer.className = 'faq-answer'; paragraph.textContent = q[locale][1]; answer.append(paragraph);
        if (q.links) {
          const links = document.createElement('div'); links.className = 'faq-answer-links';
          q.links.forEach(([href, key]) => { const a = document.createElement('a'); a.href = href; a.textContent = text[key]; links.append(a); });
          answer.append(links);
        }
        inner.append(answer); panel.append(inner); item.append(heading, panel); list.append(item);
        button.addEventListener('click', () => setOpen(openId === q.id ? null : q.id));
      });
      filter();
    }
    search.addEventListener('input', filter);
    document.getElementById('faq-reset').addEventListener('click', () => { search.value = ''; category = 'all'; filter(); search.focus(); });
    list.addEventListener('keydown', event => {
      if (!event.target.matches('.faq-question')) return;
      const buttons = Array.from(list.querySelectorAll('.faq-item:not([hidden]) .faq-question'));
      const index = buttons.indexOf(event.target);
      let next;
      if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); buttons[next].focus(); }
    });
    document.addEventListener('languageChanged', render);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
