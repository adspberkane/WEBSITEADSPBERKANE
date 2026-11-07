(function () {
  'use strict';
  const sources = {
    preparation: ['NHS', 'https://www.blood.co.uk/the-donation-process/preparing-to-donate/'],
    morocco: ['وزارة الصحة المغربية', 'https://www.sante.gov.ma/sites/Ar/Documents/JMDS-2015/D%C3%A9pliant_JMDS.pdf', 'Ministère marocain de la Santé'],
    redcross: ['American Red Cross', 'https://www.redcrossblood.org/donate-blood/blood-donation-process/before-during-after.html'],
    who: ['منظمة الصحة العالمية', 'https://www.who.int/news-room/questions-and-answers/item/blood-products-why-should-i-donate-blood', 'Organisation mondiale de la Santé'],
    canada: ['Canadian Blood Services', 'https://www.blood.ca/en/diversity/demystifying-blood-donation'],
    after: ['HSA', 'https://www.hsa.gov.sg/blood-donation/donation-process/after-donation/'],
    faint: ['NHS', 'https://www.blood.co.uk/the-donation-process/donation-advice-and-information/if-youve-just-donated/feeling-faint/'],
    misconceptions: ['HSA', 'https://www.hsa.gov.sg/blood-donation/blood-facts-and-figures/misconceptions-about-blood-donation/'],
    weight: ['Carter BloodCare', 'https://www.carterbloodcare.org/education-center/donation-myths/donating-blood-makes-you-gain-weight/']
  };
  const copy = {
    ar: { eyebrow: 'معرفة تطمئنك', intro: 'من الاستعداد إلى التعافي، معلومات واضحة وتصحيح للأفكار المتداولة بمصادر صحية موثوقة.', questionsTab: 'أسئلة حول التبرع', mythsTab: 'شائعات وحقائق', tabsLabel: 'معلومات التبرع بالدم', before: 'قبل التبرع', during: 'أثناء الزيارة', after: 'بعد التبرع', myth: 'الفكرة المتداولة', truth: 'الحقيقة', clarification: 'التوضيح', source: 'المصدر: ', external: 'يفتح في نافذة جديدة', guidance: 'هذه معلومات عامة للتوعية، واتبع دائماً تعليمات الفريق الطبي المشرف على تبرعك.', reviewLabel: 'مراجعة المصادر:' },
    fr: { eyebrow: 'Comprendre pour donner', intro: 'De la préparation à la récupération, des réponses claires et des idées reçues expliquées avec des sources fiables.', questionsTab: 'Questions sur le don', mythsTab: 'Idées reçues et vérités', tabsLabel: 'Informations sur le don de sang', before: 'Avant le don', during: 'Pendant la visite', after: 'Après le don', myth: 'Idée reçue', truth: 'La réalité', clarification: 'L’explication', source: 'Source : ', external: 'S’ouvre dans une nouvelle fenêtre', guidance: 'Ces informations sont générales, suivez toujours les consignes de l’équipe médicale qui encadre votre don.', reviewLabel: 'Sources consultées le :' }
  };
  // Wording reviewed with the site owner; medical claims retain their primary sources.
  const questions = [
    { id: 'prepare', stage: 'before', source: 'preparation',
      ar: ['كيف أستعد للتبرع بالدم؟', 'احرص على النوم الجيد في الليلة السابقة، وتناول وجباتك المعتادة، واشرب الماء بانتظام.', 'تجنّب المجهود الرياضي الشديد قبل التبرع، وارتدِ ملابس بأكمام يسهل رفعها.'],
      fr: ['Comment préparer mon don de sang ?', 'Dormez suffisamment la veille, mangez normalement et hydratez-vous régulièrement.', 'Évitez les efforts physiques intenses avant le don et portez des vêtements dont les manches se relèvent facilement.'] },
    { id: 'eat', stage: 'before', source: 'morocco',
      ar: ['هل يجب أن أكون صائماً؟', 'لا يُنصح بالحضور على معدة فارغة، تناول وجبة خفيفة قبل التبرع مع تجنّب الأطعمة كثيرة الدهون، واتبع تعليمات الفريق الطبي.'],
      fr: ['Dois-je venir à jeun ?', 'Il est déconseillé de venir le ventre vide, prenez un repas léger avant le don, évitez les aliments très gras et suivez les consignes de l’équipe médicale.'] },
    { id: 'bring', stage: 'before', source: 'redcross',
      ar: ['ماذا أحضر معي؟', 'أحضر وثيقة تعريف، وبطاقة المتبرع إن كانت لديك، ولائحة الأدوية التي تستعملها.', 'أخبر الطاقم بأي معلومات صحية مهمة، حتى إن لم تكن متأكداً من علاقتها بالتبرع.'],
      fr: ['Que dois-je apporter ?', 'Prévoyez une pièce d’identité, votre carte de donneur si vous en avez une, et la liste de vos médicaments.', 'Signalez toute information de santé importante, même si vous ignorez son lien avec le don.'] },
    { id: 'screening', stage: 'during', source: 'who',
      ar: ['ماذا يحدث قبل سحب الدم؟', 'يسألك الفريق عن صحتك وأدويتك وتاريخك الطبي، ثم يُجري التقييم اللازم للتأكد من أن التبرع مناسب لك وللمريض.', 'أجب بصراحة، فالتحاليل لا تُغني عن المقابلة الطبية.'],
      fr: ['Que se passe-t-il avant le prélèvement ?', 'L’équipe vous interroge sur votre santé, vos médicaments et vos antécédents, puis vérifie que le don convient à votre situation.', 'Répondez sincèrement, les analyses ne remplacent pas l’entretien médical.'] },
    { id: 'duration', stage: 'during', source: 'canada',
      ar: ['كم يستغرق التبرع؟', 'يستغرق سحب الدم عادة نحو عشر دقائق، لكن الزيارة تشمل أيضاً التسجيل والتقييم الطبي والاستراحة.', 'خصّص وقتاً كافياً، فالمدة الإجمالية تختلف حسب المركز والإقبال.'],
      fr: ['Combien de temps faut-il prévoir ?', 'Le prélèvement dure généralement une dizaine de minutes, et la visite comprend aussi l’inscription, l’évaluation médicale et le repos.', 'Prévoyez du temps supplémentaire, car la durée totale dépend du centre et de l’affluence.'] },
    { id: 'needle-fear', stage: 'during', source: 'canada',
      ar: ['ماذا أفعل إذا كنت أخاف الإبرة؟', 'أخبر الطاقم قبل البداية، إذ يمكنه مساعدتك على الشعور بالاطمئنان.', 'إذا شعرت بالدوخة أو عدم الارتياح أثناء التبرع، أخبره فوراً، ويمكنك طلب إيقاف التبرع إذا شعرت بتوعك.'],
      fr: ['Que faire si j’ai peur de l’aiguille ?', 'Prévenez l’équipe avant de commencer pour qu’elle puisse vous rassurer.', 'Signalez immédiatement tout vertige ou inconfort pendant le don, et demandez l’arrêt du prélèvement si vous vous sentez mal.'] },
    { id: 'rest', stage: 'after', source: 'after',
      ar: ['ماذا أفعل مباشرة بعد التبرع؟', 'استرح في المكان المخصص، وتناول الوجبة الخفيفة والمشروب قبل المغادرة.', 'اشرب الماء خلال اليوم، واتبع تعليمات الطاقم بشأن الضمادة والعناية بالذراع.'],
      fr: ['Que faire juste après le don ?', 'Reposez-vous dans l’espace prévu et prenez une collation et une boisson avant de partir.', 'Continuez à vous hydrater et respectez les consignes concernant le pansement et les soins du bras.'] },
    { id: 'exercise', stage: 'after', source: 'preparation',
      ar: ['هل يمكنني ممارسة الرياضة بعد التبرع؟', 'تجنّب الرياضة الشديدة ورفع الأوزان لمدة 24 ساعة بعد التبرع.', 'استأنف أنشطتك تدريجياً حسب شعورك وتعليمات الفريق، ولا تواصل المجهود إذا شعرت بدوخة أو تعب.'],
      fr: ['Puis-je faire du sport après le don ?', 'Évitez le sport intense et les charges lourdes pendant les 24 heures suivantes.', 'Reprenez progressivement vos activités selon votre état et les consignes reçues, et arrêtez l’effort en cas de vertige ou de fatigue.'] },
    { id: 'dizziness', stage: 'after', source: 'faint',
      ar: ['ماذا أفعل إذا شعرت بالدوخة؟', 'أخبر الطاقم فوراً إذا كنت ما زلت في مكان التبرع، وبعد المغادرة استلقِ وارفع ساقيك إن أمكن، واطلب من شخص البقاء معك.', 'انهض ببطء بعد التحسن، واطلب مساعدة طبية إذا استمرت الأعراض أو اشتدت.'],
      fr: ['Que faire si j’ai des vertiges ?', 'Sur place, prévenez immédiatement l’équipe, et après votre départ, allongez-vous et surélevez les jambes si possible en demandant à quelqu’un de rester avec vous.', 'Relevez-vous lentement après amélioration et consultez si les symptômes persistent ou s’aggravent.'] },
    { id: 'bleeding', stage: 'after', source: 'redcross',
      ar: ['ماذا أفعل إذا نزف موضع الإبرة من جديد؟', 'اضغط مباشرة على الموضع وارفع ذراعك لمدة خمس إلى عشر دقائق، أو إلى أن يتوقف النزف.', 'إذا لم يتوقف، أو شعرت بأعراض مقلقة، تواصل مع الفريق الطبي واطلب المساعدة المناسبة.'],
      fr: ['Que faire si le point de ponction saigne à nouveau ?', 'Exercez une pression directe et levez le bras pendant cinq à dix minutes, ou jusqu’à l’arrêt du saignement.', 'S’il persiste, ou si des symptômes vous inquiètent, contactez l’équipe médicale pour obtenir de l’aide.'] }
  ];
  const myths = [
    { id: 'weakness', source: 'misconceptions',
      ar: ['التبرع يترك الجسم ضعيفاً بشكل دائم', 'يعوّض الجسم مكونات الدم تدريجياً، وقد يشعر بعض المتبرعين بتعب أو دوخة مؤقتة، ولهذا تُجرى فحوص القبول وتُعطى تعليمات للراحة والتعافي.', 'ينبغي احترام الفواصل التي يحددها مركز التبرع.'],
      fr: ['Le don affaiblit définitivement l’organisme', 'L’organisme reconstitue progressivement les composants sanguins, et une fatigue ou des vertiges passagers peuvent survenir, d’où l’évaluation préalable et les conseils de récupération.', 'Respectez les délais indiqués par votre centre.'] },
    { id: 'infection', source: 'misconceptions',
      ar: ['يمكن أن أصاب بعدوى بسبب إبرة التبرع', 'تُستخدم في التبرع معدات معقمة ومخصصة للاستعمال مرة واحدة، ثم يتم التخلص منها.', 'لا تُعاد الإبرة المستعملة إلى متبرع آخر.'],
      fr: ['L’aiguille du don peut me transmettre une infection', 'Le matériel de prélèvement est stérile, à usage unique et éliminé après utilisation.', 'Une aiguille utilisée n’est pas réemployée pour un autre donneur.'] },
    { id: 'weight', source: 'weight',
      ar: ['التبرع بالدم يسبب زيادة الوزن', 'التبرع بالدم لا يسبب بحد ذاته زيادة الوزن، ولا ينبغي اعتباره وسيلة لتغيير الوزن، بل هو مساهمة لمساعدة المرضى المحتاجين إلى الدم.'],
      fr: ['Donner son sang fait grossir', 'Le don de sang ne provoque pas, à lui seul, une prise de poids et ne doit pas être envisagé comme une méthode pour modifier son poids, mais comme un geste destiné aux patients.'] },
    { id: 'common-group', source: 'canada',
      ar: ['لا فائدة من تبرعي إذا كانت فصيلتي شائعة', 'الفصائل الشائعة مطلوبة أيضاً، ويحتاج المرضى إلى فصائل مختلفة، وقد تتغير الأولويات حسب المخزون والحاجة الطبية.', 'شيوع فصيلتك لا يلغي أهمية تبرعك.'],
      fr: ['Mon don est inutile si mon groupe est courant', 'Les groupes courants sont eux aussi nécessaires, les patients ont des besoins variés et les priorités évoluent selon les stocks et les situations médicales.', 'Un groupe fréquent reste précieux.'] },
    { id: 'costs', source: 'morocco', clarification: true,
      ar: ['أتبرع مجاناً، فلماذا تُطلب مبالغ مرتبطة بالدم؟', 'تميّز وزارة الصحة المغربية بين مجانية الدم والمصاريف المرتبطة بتجهيزه، فالمبالغ المفوترة تساهم في تغطية تكاليف مثل الأكياس المعقمة والتحاليل وفصل المكونات وحفظها.', 'لذلك لا تعني مجانية التبرع أن جميع خدمات نقل الدم تُقدَّم دون مصاريف، ولتفسير فاتورة محددة يُرجى طلب التفاصيل من المؤسسة المعنية.'],
      fr: ['Je donne gratuitement, pourquoi des frais liés au sang sont-ils facturés ?', 'Le ministère marocain de la Santé distingue la gratuité du sang des frais de préparation, les montants facturés contribuant notamment aux poches stériles, aux analyses, à la séparation et à la conservation.', 'La gratuité du don ne signifie donc pas que tous les services transfusionnels sont sans frais, et pour comprendre une facture précise, demandez son détail à l’établissement concerné.'] },
    { id: 'pain', source: 'who',
      ar: ['التبرع مؤلم جداً طوال العملية', 'يشعر المتبرع عادة بوخزة قصيرة عند إدخال الإبرة، وقد يحدث انزعاج بسيط.', 'الألم الشديد أو المستمر ليس شيئاً ينبغي تحمّله بصمت، فأخبر الطاقم فوراً إذا شعرت به.'],
      fr: ['Le don est très douloureux du début à la fin', 'On ressent généralement une brève piqûre à l’insertion de l’aiguille, parfois accompagnée d’un léger inconfort.', 'Signalez immédiatement toute douleur importante ou persistante à l’équipe.'] }
  ];
  function init() {
    const tabs = document.querySelector('.facts-tabs');
    if (!tabs) return;
    const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const panels = buttons.map(b => document.getElementById(b.getAttribute('aria-controls')));
    let selected = 0, openId = null;
    const lang = () => document.documentElement.lang === 'fr' ? 'fr' : 'ar';
    function indicator() {
      const button = buttons[selected], marker = tabs.querySelector('.facts-tab-indicator');
      marker.style.width = button.offsetWidth + 'px';
      marker.style.height = button.offsetHeight + 'px';
      marker.style.top = button.offsetTop + 'px';
      marker.style.transform = `translateX(${button.offsetLeft}px)`;
    }
    function select(index, focus = false) {
      selected = index;
      buttons.forEach((button, i) => {
        button.setAttribute('aria-selected', String(i === index));
        button.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      indicator();
      if (focus) buttons[index].focus();
    }
    buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
    tabs.addEventListener('keydown', event => {
      if (!event.target.matches('[role="tab"]')) return;
      let next;
      const forward = document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      if (event.key === forward) next = (selected + 1) % buttons.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') next = (selected - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
    function sourceLink(key) {
      const [arName, href, frName] = sources[key], locale = lang();
      const link = document.createElement('a');
      link.className = 'facts-source'; link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = copy[locale].source + (locale === 'fr' ? frName || arName : arName);
      link.setAttribute('aria-label', link.textContent + ', ' + copy[locale].external);
      return link;
    }
    function paragraphs(parent, content) {
      content.slice(1).forEach(text => { const p = document.createElement('p'); p.textContent = text; parent.append(p); });
    }
    function setOpen(id) {
      openId = id;
      document.querySelectorAll('#donation-questions .faq-item').forEach(item => {
        const open = item.dataset.questionId === id;
        item.classList.toggle('is-open', open);
        item.querySelector('button').setAttribute('aria-expanded', String(open));
        const panel = item.querySelector('.faq-panel');
        panel.setAttribute('aria-hidden', String(!open)); panel.inert = !open;
      });
    }
    function render() {
      const locale = lang(), text = copy[locale];
      document.querySelectorAll('[data-facts-text]').forEach(e => { e.textContent = text[e.dataset.factsText]; });
      tabs.setAttribute('aria-label', text.tabsLabel);
      document.getElementById('facts-review-date').textContent = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date('2026-11-07T12:00:00Z'));
      const container = document.getElementById('donation-questions'); container.replaceChildren();
      ['before', 'during', 'after'].forEach(stage => {
        const group = document.createElement('section'), heading = document.createElement('h2'), list = document.createElement('div');
        group.className = 'facts-question-group'; heading.className = 'facts-group-heading'; heading.textContent = text[stage]; list.className = 'facts-question-list';
        group.append(heading, list); container.append(group);
        questions.forEach((q, index) => {
          if (q.stage !== stage) return;
          const item = document.createElement('article'), h = document.createElement('h3'), button = document.createElement('button');
          item.className = 'faq-item'; item.dataset.questionId = q.id;
          button.type = 'button'; button.className = 'faq-question'; button.id = `donation-question-${q.id}`; button.setAttribute('aria-controls', `donation-answer-${q.id}`);
          const number = document.createElement('span'), title = document.createElement('span'), toggle = document.createElement('span');
          number.className = 'faq-number'; number.textContent = String(index + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
          title.className = 'faq-question-text'; title.textContent = q[locale][0]; toggle.className = 'faq-toggle'; toggle.setAttribute('aria-hidden', 'true');
          button.append(number, title, toggle); h.append(button);
          const panel = document.createElement('div'), inner = document.createElement('div'), answer = document.createElement('div');
          panel.className = 'faq-panel'; panel.id = `donation-answer-${q.id}`; panel.setAttribute('role', 'region'); panel.setAttribute('aria-labelledby', button.id);
          inner.className = 'faq-panel-inner'; answer.className = 'faq-answer'; paragraphs(answer, q[locale]); answer.append(sourceLink(q.source));
          inner.append(answer); panel.append(inner); item.append(h, panel); list.append(item);
          button.addEventListener('click', () => setOpen(openId === q.id ? null : q.id));
        });
      });
      const grid = document.getElementById('donation-myths'); grid.replaceChildren();
      myths.forEach(myth => {
        const card = document.createElement('article'), header = document.createElement('div'), label = document.createElement('span'), h = document.createElement('h2');
        card.className = 'facts-myth-card'; header.className = 'facts-myth-header'; label.className = 'facts-myth-label'; label.textContent = text.myth; h.textContent = myth[locale][0]; header.append(label, h);
        const truth = document.createElement('div'), truthLabel = document.createElement('span');
        truth.className = 'facts-truth'; truthLabel.className = 'facts-truth-label';
        truthLabel.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>';
        truthLabel.append(document.createTextNode(myth.clarification ? text.clarification : text.truth)); truth.append(truthLabel); paragraphs(truth, myth[locale]); truth.append(sourceLink(myth.source)); card.append(header, truth); grid.append(card);
      });
      setOpen(openId); select(selected); requestAnimationFrame(indicator);
    }
    document.addEventListener('languageChanged', render);
    window.addEventListener('resize', indicator);
    if ('ResizeObserver' in window) new ResizeObserver(indicator).observe(tabs);
    if (document.fonts) document.fonts.ready.then(indicator);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
