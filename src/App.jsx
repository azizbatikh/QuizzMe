import React, { useState } from 'react';

const themes = [
  { name: 'Culture G', icon: '🧠', color: 'lavender', count: '1 240 quiz' },
  { name: 'Cinéma', icon: '🎬', color: 'peach', count: '860 quiz' },
  { name: 'Histoire', icon: '🏛️', color: 'blue', count: '590 quiz' },
  { name: 'Animaux', icon: '🦊', color: 'mint', count: '430 quiz' },
  { name: 'Drapeaux', icon: '🌍', color: 'pink', count: '320 quiz' },
  { name: 'Sciences', icon: '🔬', color: 'yellow', count: '275 quiz' },
];

const initialQuizzes = [
  { title: 'Les drapeaux du monde', category: 'Drapeaux', icon: '🌍', level: 'Facile', questions: 10, players: '2,4 k' },
  { title: 'Films cultes des années 90', category: 'Cinéma', icon: '🍿', level: 'Intermédiaire', questions: 12, players: '1,8 k' },
  { title: 'Les animaux étonnants', category: 'Animaux', icon: '🦁', level: 'Facile', questions: 8, players: '986' },
];

const leaders = [
  { name: 'LunaQuiz', points: '12 840', avatar: '🌙', color: 'avatar-lilac' },
  { name: 'Maxime_42', points: '11 290', avatar: '🧑🏻‍🚀', color: 'avatar-peach' },
  { name: 'Nina joue', points: '10 650', avatar: '🦋', color: 'avatar-blue' },
  { name: 'TotoLeBoss', points: '9 870', avatar: '🦊', color: 'avatar-green' },
];

const sampleQuestion = {
  prompt: 'Quel est le plus grand animal vivant sur Terre ?',
  answers: ['L’éléphant d’Afrique', 'La baleine bleue', 'Le requin-baleine', 'La girafe'],
  correct: 1,
};

function Icon({ name, size = 20 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    play: <><path d="m8 5 12 7-12 7z" /></>,
    create: <><path d="M12 5v14M5 12h14" /></>,
    chart: <><path d="M4 19V5M4 19h17M8 15l3-4 3 2 5-7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    crown: <><path d="m2 8 5 4 5-8 5 8 5-4-2 12H4L2 8Z" /></>,
    bolt: <><path d="m13 2-3 8h7l-6 12 1-9H6l7-11Z" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function App() {
  const [activeNav, setActiveNav] = useState('Accueil');
  const [mode, setMode] = useState('1 contre 1');
  const [selectedTheme, setSelectedTheme] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [answer, setAnswer] = useState(null);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('Culture G');

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const openCreate = () => {
    setQuizTitle('');
    setQuestion('');
    setAnswers(['', '', '', '']);
    setCorrectAnswer(0);
    setQuizCategory('Culture G');
    setModal('create');
  };

  const saveQuiz = (event) => {
    event.preventDefault();
    if (!quizTitle.trim() || !question.trim() || answers.some((item) => !item.trim())) return;
    setQuizzes((current) => [
      { title: quizTitle.trim(), category: quizCategory, icon: themes.find((theme) => theme.name === quizCategory)?.icon ?? '✨', level: 'Personnalisé', questions: 1, players: 'Nouveau', question: question.trim(), answers: answers.map((item) => item.trim()), correctAnswer },
      ...current,
    ]);
    setModal(null);
    notify('Ton quiz est créé ! Tu peux maintenant le partager 🎉');
  };

  const startQuiz = (quiz) => {
    setAnswer(null);
    setModal({ type: 'play', quiz });
  };

  const navItems = [
    { label: 'Accueil', icon: 'home' },
    { label: 'Jouer', icon: 'play' },
    { label: 'Créer un quiz', icon: 'create' },
    { label: 'Classement', icon: 'chart' },
  ];

  const visibleQuizzes = quizzes.filter((quiz) => {
    const matchesTheme = selectedTheme === 'Tous' || quiz.category === selectedTheme;
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesTheme && matchesSearch;
  });
  const activeQuestion = modal?.type === 'play' && modal.quiz.question
    ? { prompt: modal.quiz.question, answers: modal.quiz.answers, correct: modal.quiz.correctAnswer }
    : sampleQuestion;

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <a className="brand" href="#accueil" onClick={() => setActiveNav('Accueil')} aria-label="QuizzMe, accueil">
          <span className="brand-mark"><span>Q</span><i>?</i></span>
          <span>quizz<span className="brand-highlight">me</span></span>
        </a>
        <p className="side-label">MENU</p>
        <nav className="side-nav">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} aria-current={activeNav === item.label ? 'page' : undefined} onClick={() => {
              if (item.label === 'Créer un quiz') openCreate();
              else {
                setActiveNav(item.label);
                const targetId = item.label === 'Jouer' ? 'game-modes' : item.label === 'Classement' ? 'leaderboard' : 'accueil';
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}>
              <Icon name={item.icon} /><span>{item.label}</span>
              {item.label === 'Créer un quiz' && <span className="nav-plus">+</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-card">
          <span className="side-spark">✦</span>
          <p>Un quiz à partager ?</p>
          <span>Crée le tien et défie tes amis.</span>
          <button className="side-create" onClick={openCreate}>Créer un quiz <Icon name="arrow" size={16} /></button>
        </div>
        <button className="profile-mini" onClick={() => notify('La connexion et les profils arrivent avec le backend.')}>
          <span className="profile-avatar">😊</span>
          <span className="profile-text"><strong>Invité</strong><small>Prêt à jouer ?</small></span>
          <span className="profile-dots">···</span>
        </button>
      </aside>

      <main className="main-content" id="accueil">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark"><span>Q</span><i>?</i></span><b>quizz<span>me</span></b></div>
          <div className="breadcrumb"><span>Pages</span><b>/</b><strong>{activeNav}</strong></div>
          <div className="top-actions">
            <label className="search-box">
              <Icon name="search" size={18} />
              <input aria-label="Rechercher un quiz ou un thème" placeholder="Rechercher un quiz..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('Tu es à jour, aucune nouvelle notification.')}>♧<i /></button>
            <button className="top-profile" onClick={() => notify('La connexion et les profils arrivent avec le backend.')}><span>😊</span><b>Invité</b><span className="chevron">⌄</span></button>
          </div>
        </header>

        <div className="page-body">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">LUNDI 26 OCTOBRE 2026 <span>✦</span> BONJOUR, JOUEUR !</p>
              <h1>Le savoir se joue<br />à plusieurs<span className="title-dot">.</span></h1>
              <p className="welcome-copy">Teste tes connaissances, crée tes quiz et défie<br className="desktop-break" /> tes amis. Prêt à jouer ?</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => { setActiveNav('Jouer'); document.getElementById('game-modes')?.scrollIntoView({ behavior: 'smooth' }); }}>Trouver une partie <Icon name="arrow" size={18} /></button>
                <button className="text-button" onClick={openCreate}><span className="text-plus">+</span> Créer un quiz</button>
              </div>
            </div>
            <div className="hero-art" aria-label="Illustration de quiz et de jeu">
              <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
              <span className="art-star star-one">✦</span><span className="art-star star-two">✧</span>
              <div className="art-card card-back"><span>?</span><i>✦</i></div>
              <div className="art-card card-front"><span className="art-trophy">🏆</span><strong>BRAVO !</strong><small>Bonne réponse</small><div className="art-progress"><i /></div><b>+ 250 pts</b></div>
              <div className="art-bubble bubble-left">🎯</div><div className="art-bubble bubble-right">⚡</div>
              <span className="art-confetti confetti-a">✦</span><span className="art-confetti confetti-b">●</span>
            </div>
          </section>

          <section className="stats-strip" aria-label="Statistiques QuizzMe">
            <div className="stat-item"><span className="stat-icon stat-purple">✦</span><div><strong>3 420+</strong><small>quiz à découvrir</small></div></div>
            <div className="stat-item"><span className="stat-icon stat-orange">♧</span><div><strong>12 580</strong><small>joueurs actifs</small></div></div>
            <div className="stat-item"><span className="stat-icon stat-green">⚡</span><div><strong>850+</strong><small>parties aujourd’hui</small></div></div>
            <div className="stat-item"><span className="stat-icon stat-pink">♡</span><div><strong>100%</strong><small>fun garanti</small></div></div>
          </section>

          <section className="modes-section" id="game-modes">
            <div className="section-heading"><div><p className="eyebrow">À TOI DE CHOISIR</p><h2>Comment tu veux jouer ?</h2></div><span className="section-aside">Joue avec tes amis ou rencontre de nouveaux joueurs ✨</span></div>
            <div className="mode-grid">
              {[
                { name: '1 contre 1', icon: '⚔️', description: 'Un duel, un gagnant. Que le meilleur joue !', color: 'mode-lilac', tag: 'POPULAIRE' },
                { name: '2 contre 2', icon: '🤝', description: 'Forme ton équipe et jouez ensemble.', color: 'mode-peach', tag: 'EN ÉQUIPE' },
                { name: 'JCJ en groupe', icon: '🎉', description: 'Jusqu’à 20 joueurs dans la même partie.', color: 'mode-blue', tag: 'JUSQU’À 20' },
              ].map((item) => (
                <button key={item.name} className={`mode-card ${item.color} ${mode === item.name ? 'mode-selected' : ''}`} aria-pressed={mode === item.name} onClick={() => setMode(item.name)}>
                  <span className="mode-tag">{item.tag}</span><span className="mode-icon">{item.icon}</span>
                  <strong>{item.name}</strong><span className="mode-description">{item.description}</span>
                  <span className="mode-cta">{mode === item.name ? 'Mode sélectionné' : 'Choisir ce mode'} <Icon name="arrow" size={16} /></span>
                </button>
              ))}
            </div>
            <div className="play-bar"><div><span className="online-dot" /> <strong>Mode choisi : {mode}</strong><span className="play-hint">Trouve une partie publique ou invite tes amis.</span></div><button className="primary-button play-button" onClick={() => setModal('join')}>Jouer maintenant <Icon name="arrow" size={18} /></button></div>
          </section>

          <div className="discovery-layout">
            <section className="discover-section">
              <div className="section-heading discover-heading"><div><p className="eyebrow">EXPLORE L’UNIVERS</p><h2>Un thème, un défi</h2></div><button className="view-all" onClick={() => setSelectedTheme('Tous')}>Voir tous les quiz <Icon name="arrow" size={16} /></button></div>
              <div className="theme-grid">
                {themes.map((theme) => <button key={theme.name} onClick={() => { setSelectedTheme(theme.name); document.getElementById('quiz-list')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className={`theme-card theme-${theme.color} ${selectedTheme === theme.name ? 'theme-active' : ''}`}><span className="theme-emoji">{theme.icon}</span><strong>{theme.name}</strong><small>{theme.count}</small></button>)}
              </div>
              <div className="section-heading quiz-heading" id="quiz-list"><div><p className="eyebrow">{selectedTheme === 'Tous' ? 'FAIS TON CHOIX' : `THÈME : ${selectedTheme.toUpperCase()}`}</p><h2>Les quiz du moment</h2></div><button className="filter-button" onClick={() => setSelectedTheme(selectedTheme === 'Tous' ? 'Culture G' : 'Tous')}>☷ <span>{selectedTheme === 'Tous' ? 'Filtrer' : 'Tout voir'}</span></button></div>
              <div className="quiz-list">
                {visibleQuizzes.length ? visibleQuizzes.map((quiz, index) => <article className="quiz-card" key={`${quiz.title}-${index}`}><div className={`quiz-emoji quiz-emoji-${index % 3}`}>{quiz.icon}</div><div className="quiz-info"><strong data-quiz-title>{quiz.title}</strong><span>{quiz.category} <i>·</i> {quiz.questions} questions</span></div><span className={`difficulty difficulty-${quiz.level === 'Facile' ? 'easy' : 'medium'}`}>{quiz.level}</span><span className="quiz-players"><Icon name="users" size={15} /> {quiz.players}</span><button className="quiz-play" aria-label={`Jouer à ${quiz.title}`} onClick={() => startQuiz(quiz)}><Icon name="play" size={16} /></button></article>) : <div className="empty-state">Pas encore de quiz dans ce thème. <button onClick={openCreate}>Crée le premier !</button></div>}
              </div>
            </section>

            <aside className="leaderboard-panel" id="leaderboard">
              <div className="section-heading leaderboard-heading"><div><p className="eyebrow">ILS SONT AU TOP</p><h2>Classement</h2></div><span className="crown-badge"><Icon name="crown" size={17} /></span></div>
              <div className="leader-period"><span className="period-dot" /> Cette semaine <span>⌄</span></div>
              <div className="podium">
                <div className="podium-person second"><span className="podium-avatar avatar-peach">🧑🏻‍🚀</span><span className="podium-crown">♛</span><strong>Maxime</strong><small>11 290 pts</small><b>2</b></div>
                <div className="podium-person first"><span className="podium-avatar avatar-lilac">🌙</span><span className="podium-crown">♛</span><strong>LunaQuiz</strong><small>12 840 pts</small><b>1</b></div>
                <div className="podium-person third"><span className="podium-avatar avatar-blue">🦋</span><span className="podium-crown">♛</span><strong>Nina joue</strong><small>10 650 pts</small><b>3</b></div>
              </div>
              <div className="leader-list">{leaders.map((leader, index) => <div className="leader-row" key={leader.name}><span className="leader-rank">{String(index + 1).padStart(2, '0')}</span><span className={`leader-avatar ${leader.color}`}>{leader.avatar}</span><strong>{leader.name}</strong><span>{leader.points} <small>pts</small></span></div>)}</div>
              <button className="leader-more" onClick={() => setActiveNav('Classement')}>Voir le classement complet <Icon name="arrow" size={15} /></button>
            </aside>
          </div>

          <section className="creator-banner"><div className="banner-icon">✨</div><div><strong>Tu as l’âme d’un créateur ?</strong><span>Imagine tes questions, choisis tes 4 réponses et partage ton quiz avec la communauté.</span></div><button onClick={openCreate}>Créer mon quiz <Icon name="arrow" size={17} /></button><span className="banner-sparkle">✦</span></section>
          <footer className="footer"><span>© 2026 QuizzMe</span><span>Apprendre, jouer, recommencer <i>♥</i></span><button onClick={() => notify('Les réglages seront disponibles dans ton profil.')}>Confidentialité &nbsp;·&nbsp; Aide</button></footer>
        </div>
      </main>

      {modal === 'create' && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}><section className="modal-card create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title"><button className="modal-close" aria-label="Fermer" onClick={() => setModal(null)}><Icon name="close" /></button><span className="modal-kicker">À TOI DE JOUER</span><h2 id="create-title">Crée ton quiz <span>✦</span></h2><p className="modal-intro">Une question, quatre choix, et c’est parti !</p><form onSubmit={saveQuiz}><label className="field-label">Nom de ton quiz<input required maxLength="60" value={quizTitle} onChange={(event) => setQuizTitle(event.target.value)} placeholder="Ex. Les secrets du cinéma" /></label><label className="field-label">Thème<select value={quizCategory} onChange={(event) => setQuizCategory(event.target.value)}>{themes.map((theme) => <option key={theme.name}>{theme.name}</option>)}</select></label><label className="field-label">Ta question<input required maxLength="180" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Écris ta question ici..." /></label><div className="field-label">Les 4 réponses <small className="field-hint">Clique sur la pastille de la bonne réponse</small></div><div className="answer-fields">{answers.map((item, index) => <div className={`answer-input answer-input-${index}`} key={index}><button type="button" aria-label={`Marquer la réponse ${index + 1} comme correcte`} aria-pressed={correctAnswer === index} onClick={() => setCorrectAnswer(index)}>{correctAnswer === index ? '✓' : String.fromCharCode(65 + index)}</button><input required maxLength="100" value={item} onChange={(event) => setAnswers((current) => current.map((value, position) => position === index ? event.target.value : value))} placeholder={`Réponse ${String.fromCharCode(65 + index)}`} /></div>)}</div><div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setModal(null)}>Annuler</button><button type="submit" className="primary-button">Créer mon quiz <Icon name="arrow" size={17} /></button></div></form></section></div>}

      {modal === 'join' && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}><section className="modal-card join-modal" role="dialog" aria-modal="true" aria-labelledby="join-title"><button className="modal-close" aria-label="Fermer" onClick={() => setModal(null)}><Icon name="close" /></button><span className="join-emoji">🎮</span><h2 id="join-title">La partie t’attend !</h2><p>Le jeu en ligne arrive bientôt. En attendant, lance un quiz pour tester tes connaissances.</p><label className="field-label">Code d’invitation (facultatif)<input maxLength="8" placeholder="Ex. QZ42ME" /></label><button className="primary-button full-button" onClick={() => startQuiz(quizzes[0])}>Lancer une partie démo <Icon name="arrow" size={18} /></button><span className="join-note"><Icon name="users" size={15} /> Mode : {mode}</span></section></div>}

      {modal?.type === 'play' && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}><section className="modal-card play-modal" role="dialog" aria-modal="true" aria-labelledby="play-title"><button className="modal-close" aria-label="Fermer" onClick={() => setModal(null)}><Icon name="close" /></button><div className="question-top"><span>{modal.quiz.icon} &nbsp;{modal.quiz.category}</span><span>QUESTION 1 / {modal.quiz.questions}</span></div><div className="question-progress"><i /></div><span className="modal-kicker">À TOI DE JOUER !</span><h2 id="play-title">{activeQuestion.prompt}</h2><div className="play-answers">{activeQuestion.answers.map((choice, index) => <button key={choice} disabled={answer !== null} className={`${answer === index ? (index === activeQuestion.correct ? 'answer-correct' : 'answer-wrong') : answer !== null && index === activeQuestion.correct ? 'answer-correct' : ''}`} onClick={() => setAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}{answer !== null && index === activeQuestion.correct && <b>✓</b>}</button>)}</div>{answer !== null && <div className={`answer-feedback ${answer === activeQuestion.correct ? 'feedback-good' : 'feedback-bad'}`}>{answer === activeQuestion.correct ? 'Bien joué, c’est la bonne réponse ! 🎉' : `Oups ! La bonne réponse était : ${activeQuestion.answers[activeQuestion.correct]}.`}<button onClick={() => { setModal(null); notify(answer === activeQuestion.correct ? '+250 points ajoutés à ton score !' : 'Partie terminée, retente ta chance !'); }}>Terminer <Icon name="arrow" size={15} /></button></div>}<div className="question-footer"><span><Icon name="bolt" size={15} /> 250 points à gagner</span><span>⏱ 20 sec</span></div></section></div>}

      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  );
}

export default App;
