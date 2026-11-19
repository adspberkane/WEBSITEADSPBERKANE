// Preserve links to sections that previously lived on the homepage.
(function () {
  const pages = {
    '#compatibility': 'donation.html', '#eligibility': 'donation.html',
    '#recovery-simulator': 'donation.html', '#resources': 'donation.html',
    '#register': 'donation.html', '#gallery': 'activities.html',
    '#teams-leaderboard': 'teams.html'
  };
  const target = pages[window.location.hash];
  if (target) window.location.replace(target + window.location.search + window.location.hash);
})();
