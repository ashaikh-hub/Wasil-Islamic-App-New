export const getSelectedTafsirLanguage = (
  tafsirListData,
  selectedTafsirIdOrSlug,
) => {
  const selectedTafsir = tafsirListData?.tafsirs.find(
    tafsir =>
      tafsir.slug === selectedTafsirIdOrSlug ||
      tafsir.id === Number(selectedTafsirIdOrSlug),
  );
  return selectedTafsir?.languageName;
};

export const getTafsirsLanguageOptions = () => {
  return ['english', 'bengali', 'arabic', 'russian', 'urdu', 'Kurdish'].map(
    (item, i) => ({name: item, id: i + 1}),
  );
};
