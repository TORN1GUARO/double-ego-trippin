'use strict';
const situations = {
  clarity: {
    label: '01 / ясность', title: 'Перевести твой опыт на язык аудитории.',
    description: 'Возможно, дело не в недостатке экспертности, а в том, что её ценность пока трудно считать из профиля.',
    steps: ['Разобрать, с какими задачами к тебе уже обращаются.', 'Выделить аудиторию и конкретную пользу твоей работы.', 'Собрать понятное описание профиля и первый закреплённый пост.'],
    outcome: 'Одна ясная фраза: кому ты помогаешь, с чем и в каком формате.',
    situation: 'Есть опыт, но сложно рассказать о себе'
  },
  attention: {
    label: '02 / путь к обращению', title: 'Понять, где внимание теряет направление.',
    description: 'Просмотр ещё не означает готовность купить. Стоит проверить, кто смотрит контент и понимают ли эти люди, что ты предлагаешь.',
    steps: ['Посмотреть, какие темы привлекают потенциальных клиентов.', 'Пройти путь от ролика до профиля и обращения.', 'Проверить одно понятное предложение и призыв к диалогу.'],
    outcome: 'Одна проверяемая связка: контент → профиль → понятный следующий шаг.',
    situation: 'Есть просмотры, но мало обращений'
  },
  product: {
    label: '03 / идея продукта', title: 'Начать с запроса, а не с большого запуска.',
    description: 'Идея курса — только гипотеза. Сначала важно понять, какую задачу люди хотят решить и подходит ли им твой формат помощи.',
    steps: ['Собрать повторяющиеся запросы и вопросы аудитории.', 'Сформулировать небольшой продукт и его границы.', 'Проверить интерес через разговоры и пробный формат.'],
    outcome: 'Черновик предложения и небольшой план проверки спроса до больших вложений.',
    situation: 'Хочу продукт, но не знаю, с чего начать'
  },
  voice: {
    label: '04 / свой голос', title: 'Оставить в блоге человека, которым ты являешься.',
    description: 'Чужая подача может собирать внимание, но быть неудобной тебе. Поищем темы и форму, которые связаны с твоим опытом и интересами.',
    steps: ['Обсудить, что тебе важно и что не хочется изображать.', 'Найти связь личных тем с твоей профессиональной работой.', 'Наметить три рубрики и комфортный ритм публикаций.'],
    outcome: 'Небольшая карта тем и принципов подачи, на которые можно опереться.',
    situation: 'Блог не похож на меня. Хочется своего голоса'
  }
};

let selectedSituation = 'clarity';
let previousFocus = null;
const $ = (id) => document.getElementById(id);
const choices = [...document.querySelectorAll('[data-situation]')];

function selectSituation(key) {
  const data = situations[key];
  if (!data) return;
  selectedSituation = key;
  choices.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.situation === key)));
  $('result-label').textContent = data.label;
  $('result-title').textContent = data.title;
  $('result-description').textContent = data.description;
  $('result-steps').replaceChildren(...data.steps.map((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    return li;
  }));
  $('result-outcome').textContent = data.outcome;
}

choices.forEach((button) => button.addEventListener('click', () => {
  selectSituation(button.dataset.situation);
  if (window.matchMedia('(max-width: 760px)').matches) {
    $('recommendation').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  }
}));

const dialog = $('brief-dialog');
function openBrief() {
  previousFocus = document.activeElement;
  $('copy-status').textContent = '';
  $('brief-form').hidden = false;
  $('brief-result').hidden = true;
  dialog.showModal();
  document.body.classList.add('modal-open');
  $('brief-name').focus();
}
$('result-cta').addEventListener('click', openBrief);
$('open-brief').addEventListener('click', openBrief);
$('close-brief').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (previousFocus) previousFocus.focus();
});
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

function makeBrief(name, project, goal, key) {
  const greeting = name.trim() ? `Привет, Богдан! Меня зовут ${name.trim()}.` : 'Привет, Богдан!';
  return `${greeting}\n\nМой проект: ${project.trim()}.\nМоя ситуация: ${situations[key].situation}.${goal.trim() ? `\nХочу изменить: ${goal.trim()}.` : ''}\n\nНа сайте double ego trippin’ мне откликнулась идея: ${situations[key].outcome}\nХочу познакомиться и понять, можем ли мы поработать вместе.`;
}

$('brief-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const project = $('brief-project');
  project.setCustomValidity('');
  if (!project.value.trim()) {
    project.setCustomValidity('Напиши пару слов о своём проекте.');
    project.reportValidity();
    return;
  }
  if (!$('brief-form').reportValidity()) return;
  $('brief-text').value = makeBrief($('brief-name').value, project.value, $('brief-goal').value, selectedSituation);
  $('brief-form').hidden = true;
  $('brief-result').hidden = false;
  $('brief-text').focus();
});
$('brief-project').addEventListener('input', () => $('brief-project').setCustomValidity(''));
$('edit-brief').addEventListener('click', () => {
  $('brief-result').hidden = true;
  $('brief-form').hidden = false;
  $('copy-status').textContent = '';
  $('brief-project').focus();
});
$('copy-brief').addEventListener('click', async () => {
  const field = $('brief-text');
  if (!field.value.trim()) {
    $('copy-status').textContent = 'Добавь текст сообщения перед копированием.';
    field.focus();
    return;
  }
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(field.value);
    $('copy-status').textContent = 'Скопировано. Открой мой Telegram и вставь сообщение в диалог.';
  } catch {
    field.focus();
    field.select();
    field.setSelectionRange(0, field.value.length);
    $('copy-status').textContent = 'Текст выделен. Выбери «Копировать» или нажми Ctrl+C / ⌘C.';
  }
});
