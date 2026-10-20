# Wasil App — UI/Design Audit & Fix Plan

Scope: every module under `src/containers` (17 feature modules × 3 themes: Blue = base folder, `*Green`, `*White`), plus `src/theme` and `src/navigation`.
Paths below point at the **Blue** copy; the same issue exists in the matching `Green`/`White` file unless noted.

---

## Part 1 — Root causes (fix these first; they cause most per-screen bugs)

### 1.1 Every screen is copied three times, once per theme
- ~905 JS files / ~270k lines. `diff Qibla/ QiblaGreen/` shows the files differ **only in colour constants**. Same for Prayer (55k lines × 3), Quran (18k × 3), etc.
- `navigation/AppNavigator.js` (2,046 lines) repeats each `Stack.Screen` three times inside `theme === "blue" ? … : theme === "green" ? … : …`.
- Result: a layout fix made in one theme is missing in the other two (e.g. the Tasbih bug in 1.6 exists in Blue+Green but not White), and screens drift apart visually.

**Solution**
1. `src/theme/blue.js|green.js|white.js` already exist but are almost unused. Extend them into full semantic tokens and make every screen read them from `useTheme()`:
   ```js
   // src/theme/blue.js
   export default {
     name: 'blue', statusBar: 'light-content',
     background: '#43288A', surface: '#281658', surfaceAlt: '#311C68',
     accent: '#7F76B7', gold: '#CC9944',
     textPrimary: '#FFFFFF', textSecondary: '#CEB6F8', textOnCard: '#FFFFFF',
     border: '#7F76B7', chipActive: '#7F76B7',
   };
   // green.js / white.js: same keys, their own values (white: background '#FFFFFF', textPrimary '#060505', statusBar 'dark-content' …)
   ```
2. Write each screen **once** and build styles from the theme:
   ```js
   const { Colors } = useTheme();
   const styles = useMemo(() => makeStyles(Colors), [Colors]);
   ```
3. Collapse the navigator: one `Stack.Screen` per route, options from a helper:
   ```js
   const headerOptions = (C, title) => ({
     title, headerTitleAlign: 'center', animation: 'slide_from_right',
     headerTintColor: C.textPrimary,
     headerStyle: { backgroundColor: C.background },
     headerTitleStyle: { ...Fonts.heading, color: C.textPrimary, fontSize: 18 },
   });
   <Stack.Screen name="AboutUs" component={AboutUs} options={headerOptions(Colors, 'About Us')} />
   ```
4. Migrate module by module (smallest first: Qibla → Shahadah → Calendar → Reel → Greetings …), delete the `Green`/`White` folders as each is merged.

### 1.2 Sizes are hard-coded pixels; nothing scales
- 0 uses of `scale()/moderateScale()` outside Quran even though `react-native-size-matters` is installed.
- 2,800+ literal `fontSize: N`; fixed widths wider than small phones (`width: 396`, `width: 400`, `width: 360`, `width: 320`).
- 50+ files do `const { width, height } = Dimensions.get('window')` at module load → wrong after rotation/split-screen/foldables.

**Solution**
```js
// src/theme/metrics.js
import { useWindowDimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
export const s = scale, vs = verticalScale, ms = (n) => moderateScale(n, 0.3);
export const useScreen = () => { const { width, height } = useWindowDimensions(); return { width, height, isSmall: width < 360 }; };
```
- Replace `Dimensions.get` at module scope with `useWindowDimensions()` inside the component.
- Replace fixed widths with `width: '100%'` + `maxWidth`, or `aspectRatio`.
- Use `ms(fontSize)` for text, `s()` for horizontal, `vs()` for vertical spacing.

### 1.3 Safe areas & status bar handled with `top:` hacks
- Only 3 screens use `react-native-safe-area-context`. Others use `top: 20`, `top: 40`, `top: Platform.OS==='ios'?80:80`, `paddingTop` guesses → content under the notch / Dynamic Island / Android cutout, and bottom buttons under the home indicator.
- `WallOfRemembrance/WallBlueDetail.js:6` imports `SafeAreaView` from `react-native` (iOS-only, deprecated).
- 100+ `<StatusBar>` instances, only 16 set `barStyle`. White theme uses `backgroundColor={Colors.black}` on white screens (`HomeNew/HomeNewWhite.js:391`, `QiblaWhite`, `DuaNewWhite/*`) → black bar on a white UI.

**Solution**
- Wrap the app in `<SafeAreaProvider>` (App.tsx) and use `SafeAreaView` from `react-native-safe-area-context` with `edges` per screen, or `useSafeAreaInsets()` for absolutely positioned bars.
- Remove per-screen `<StatusBar>`; set once in the theme-aware root:
  ```jsx
  <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.background} />
  ```

### 1.4 Layout built with `position:absolute` + `top/left/bottom` nudges
- 100+ absolute positions and many relative `top:`/`bottom:`/`left:` offsets used to "push" elements into place (e.g. button text centred with `top: 12`). These break as soon as text length, font, or screen size changes.

**Solution**: use flexbox (`justifyContent/alignItems`, `gap`, `padding`) and only absolute-position true overlays (badges, FAB, mini-player) using insets.

### 1.5 Typography is not centralised
- `fontFamily: Platform.OS === 'ios' ? "Nunito Sans 7pt" : "NunitoSansRegular"` is repeated hundreds of times; several near-unreadable sizes (8–9 pt).
- No `maxFontSizeMultiplier`, so large accessibility font sizes break fixed-height cards.

**Solution**
```js
// src/theme/fonts.js
const ios = Platform.OS === 'ios';
export const Fonts = {
  body:    { fontFamily: ios ? 'Nunito Sans 7pt' : 'NunitoSansRegular' },
  heading: { fontFamily: ios ? 'Asul-Bold' : 'AsulBold' },
  arabic:  { fontFamily: ios ? 'Al Qalam Quran Majeed Web' : 'AlQalamQuran' },
};
export const Type = { caption: 11, body: 14, subtitle: 16, title: 20, display: 28 }; // min 11
```
And a shared `<AppText variant="body">` that applies `maxFontSizeMultiplier={1.3}`. Any card that contains text must use `minHeight`, not `height`.

### 1.6 No accessibility, little feedback
- 0 `accessibilityLabel` / `accessibilityRole` in the whole app. Icon-only buttons (reset, settings, play, heart) are unreadable to screen readers and many touch targets are < 44pt (`locationBox1` is 100×20).
- Loading = bare spinner on a white view (flash on dark themes); error = plain text with no retry.

**Solution**: shared `<IconButton accessibilityLabel hitSlop={8} />` with min 44×44, shared `<ScreenState loading error onRetry>` using theme background + skeletons (`react-native-skeleton-placeholder` is already installed).

---

## Part 2 — Screen-by-screen issues and fixes

### Home (`HomeNew/`)
| Screen / file | Issue | Fix |
|---|---|---|
| `HomeNewBlue.js:85` & `:127` | Two `useEffect`s both register a `focus` listener → home data fetched twice per focus, two BackHandlers (first one leaks because the ref is overwritten). | Delete the second `useEffect` (lines ~127–150). |
| `HomeNewBlue.js:385` | Loading/error views have no background → white flash on Blue/Green; error has no retry. | Use `ScreenState` with `backgroundColor: Colors.background` and a **Retry** button calling `fetchHomeData`. |
| `HomeNewBlue.js:492` | `gradientSection { top: 40 }` shifts content down without adding scroll space → last card cut off; `colors={['#43288A','#43288A','#43288A']}` is a gradient of one colour. | Use `marginTop: 40` (or `paddingTop`) and a plain `View` with `Colors.background`. Replace `<View style={{height:70}}/>` with `contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}`. |
| `HomeNewBlue.js:18` | Imports `AzanSetuoComponent.android` explicitly → Android file also runs on iOS. | `import AzanSetupComponent from './AzanSetupComponent'` and let Metro pick `.ios.js` / `.android.js` (rename both files to the same base name). |
| `HomeHeaderBlue.js:349` | Header has fixed `height: 185` but stacks location chip + Hijri + Gregorian + "Now" + 22pt time + "Upcoming" + button (~215pt) → overflows into the grid; `top: 20` instead of safe-area. | `minHeight: vs(200)`, `paddingTop: insets.top + 8`, remove `top`. |
| `HomeHeaderBlue.js:355` | Countdown ring positioned with `position:absolute; left: 140/160` → overlaps text on 360dp phones, floats in empty space on tablets; network banner with `resizeMode:"contain"` leaves gaps. | Lay the header out as `flexDirection: 'row'`: left column (texts, `flex:1`), right column (ring). Banner: `resizeMode: 'cover'` and a local fallback image. |
| `HomeHeaderBlue.js:414,430` | 8pt/9pt text ("View All Prayer Times", Gregorian date) – unreadable; 100×20 button too small to tap. | Min 11pt; button `paddingVertical: 6, paddingHorizontal: 12`, `hitSlop`. |
| `HomeHeaderBlue.js` countdown | When the countdown reaches 0 it wraps to ~24h for the same prayer instead of advancing to the next prayer. | When `diff <= 0`, call a parent callback (`onPrayerPassed`) that recomputes `nextPrayer`. |
| `HomeHeaderBlue.js` location chip | Tapping it updates local lat/long but the address/prayer times never refresh → button appears to do nothing; `maxWidth: '30%'` truncates most city names. | Save coords to storage then call parent `onLocationChanged()` → `fetchHomeData()`; `maxWidth: '55%'`. |
| `HomeGridBlue.js:32` | Item width computed from module-level `Dimensions`; each icon has hand-tuned `top/right/marginBottom` offsets so icons/labels don't align. | Compute in render from `useWindowDimensions`; give icons a fixed 32×32 box and remove per-item `iconStyle`. Consider 4 columns on < 360dp. |
| `DuaCardNewListBlue.js:157` | Card `width*0.95` + `marginHorizontal` but paging uses full `width` → cards drift off-centre after a few swipes; fixed `height: 170` clips long duas. | Use `snapToInterval={cardWidth + gap}`, `decelerationRate="fast"`, `minHeight`. |
| `IslamicStoriesSectionBlue.js`, `RecitersSectionBlue.js` | Fixed `height: 220`, `top: 10/30` offsets → uneven spacing between sections. | Section wrapper with `marginTop: vs(24)` and no `top`. |
| `WallOfRemembranceBlue.js:217` | 8pt text. | ≥ 11pt. |
| `QuranCompletionCardBlue.js:229` | 9pt label. | ≥ 11pt. |

### Quran (`Quran/`)
| Screen / file | Issue | Fix |
|---|---|---|
| `screens/QuranMainDashboard/index.js:489` | `ayahCard { width: 396, height: 200 }` → wider than iPhone SE/13 mini/most Androids (360–393dp); text clipped. | `width: '100%'`, `minHeight: 200`. |
| `screens/SurahDetailPage/index.js:1707` | Bismillah image `width: 320` + `top: 15`. | `width: '80%'`, `aspectRatio`, `marginTop`. |
| `screens/SurahDetailPage/index.js:2574` | Share card `width: 360`. | `width: Math.min(360, width - 32)`. |
| `screens/SurahFullView/index.js:578` | Floating button at `top: height*0.7` (module-level height) — overlaps the bottom player on short screens, floats mid-screen on tall ones. | `position:'absolute', bottom: insets.bottom + playerHeight + 16, right: 16`. |
| `SurahDetailPage/index.js` (2,664 lines) | One file holds list, player, modals, share. Hard to keep design consistent. | Split into `AyahItem`, `PlayerBar`, `ShareAyahModal`. |
| All Quran screens | 196 hard-coded hex colours ignore the theme. | Replace with theme tokens. |

### Prayer (`Prayer/`)
| Screen / file | Issue | Fix |
|---|---|---|
| `PrayerGuide/*/*/FirstRakat.js` etc. (≈60 files) | Expanded steps use fixed heights (`height: 550/650/680/780/800`) for text → text cut off with large fonts / translations, or large empty gaps. | Remove `height` from expanded containers; let content size itself (`paddingVertical`). |
| Same files | 40 `useState`s per screen (`showComponmentStepOne`, `…ArrowU`, `…ArrowD`, `…bgcolor` × 8) and each rakat is a separate 1,000-line copy. | Data-driven `<StepAccordion steps={fajrFarzRakat1} />`; one `openIndex` state; arrow & colour derived from it. Steps defined in JSON (title, image, arabic, translation). |
| Same files | `<Image source={Images.PrayerNiyat} />` with no size → renders at raw bitmap size (overflows on small screens, tiny on tablets). | `style={{ width: '100%', aspectRatio: 1.2, resizeMode: 'contain' }}`. |
| Same files | `LogBox.ignoreAllLogs()` in every screen hides real layout warnings. | Remove; keep it only in `App.tsx` dev config if at all. |
| `PrayerGuide/PrayerHeader.js:28` | `SCREEN_WIDTH` at module scope. | `useWindowDimensions`. |
| `PrayerAblutionNew/*.js` | Same fixed-width pattern for Wudu/Tayammum steps. | Same `StepAccordion`. |
| `PrayerGuide/PrayerTimeSectionNew.js:5` | Imports `.android` file directly. | Platform-extension import. |

### Tasbih (`Tasbih/`)
| Screen / file | Issue | Fix |
|---|---|---|
| `TasbihCounterScreen.js:702` | `backgroundColor: "Colors.white"` (a **string**, not the variable) → bead selector has no background on Blue & Green. | `backgroundColor: Colors.white`. |
| `TasbihCounterScreen.js:727` | `bottomBar { height: height*0.04 }` (~30pt) contains a 36pt counter → overflows; counter container nudged with `bottom: 10`. | `minHeight: 64`, `alignItems:'center'`, remove `bottom`. |
| `TasbihCounterScreen.js:451` | Bead area `height: 350, top: 80`; selector `bottom: 50` → beads and selector overlap on ≤ 667pt screens, gap on tall screens. | Column layout: `card` (auto) → `bottomBar` → bead area `flex: 1` → selector with `paddingBottom: insets.bottom`. |
| Settings bottom sheet (`Modal`) | Target `TextInput` at the bottom with no `KeyboardAvoidingView` → keyboard covers it; backdrop is fully transparent so the sheet looks detached. | Wrap sheet in `KeyboardAvoidingView behavior={ios?'padding':'height'}`; backdrop `rgba(0,0,0,0.4)`. |
| Counter text | `allowFontScaling={false}` everywhere. | Use `maxFontSizeMultiplier={1.2}` instead. |

### Greetings (`Greetings/`)
| Screen / file | Issue | Fix |
|---|---|---|
| `GreetingCardShare.js:200` | Card image `width: 400, height: 500, resizeMode: "stretch"` → cut off on every phone < 400dp and distorted. | `width: width - 32, aspectRatio: 4/5, resizeMode: 'cover'`. |
| `GreetingCardShare.js:245` | `extralayer { width: 400, top: -4, zIndex: -1 }` | Same width as image; remove `top/zIndex`. |
| `GreetingCardShare.js` submit | Button text centred with `top: 12/10`. | `justifyContent:'center', alignItems:'center'` on the button. |
| `GreetingsNew.js:118` | Line breaks hard-coded per category name ("Thank You", "Eid ul Fitr"). | `numberOfLines={2}` + fixed chip width; remove string special-casing. |
| `GreetingCardListNew.js:7` | Module-level `Dimensions`. | `useWindowDimensions`. |

### Wall of Remembrance (`WallOfRemembrance/`)
| Screen / file | Issue | Fix |
|---|---|---|
| `RemembranceFormBlue.js:250` | 7 `TextInput`s in a `ScrollView` with no `KeyboardAvoidingView` → lower fields and the submit button hidden behind the keyboard on iOS. | Wrap in `KeyboardAvoidingView` (or `react-native-keyboard-aware-scroll-view`), add `returnKeyType="next"` + focus chaining. |
| `RemembranceFormBlue.js:531`, `Wallofremember.js:267` | Text boxes `width: 300` / `250`. | `width: '85%'`. |
| `Wallofremember.js:275` | 9pt subtitle. | ≥ 11pt. |
| `WallBlueDetail.js:6` | `SafeAreaView` from `react-native`. | Import from `react-native-safe-area-context`. |
| Module | Form/detail split per theme as separate files (`RemembranceFormBlue/Green/White`) inside one module. | Single themed component. |

### Qibla (`Qibla/QiblaCompassNew.js`)
| Issue | Fix |
|---|---|
| Compass `top: 150` absolute and info text `top: 600` absolute (`:232`, `:246`) → on 667pt phones the info text sits under the dial selector; on tall phones big empty gap. | Flex column: direction text → compass (`width: min(width,height*0.5)*0.9`, `aspectRatio:1`) → info text → selector. |
| Degree text and label both use `bottom: 40` to align. | Put them in one row with `alignItems:'baseline'`. |
| Dial selector `bottom: 0` ignores home indicator. | `paddingBottom: insets.bottom`. |
| No feedback when compass sensor is unavailable/uncalibrated. | Show "Calibrate: move phone in a figure-8" banner when accuracy is low. |

### Shahadah (`Shahadah/`)
| Issue | Fix |
|---|---|
| Three identical copies differing only in colour. | Easiest module to merge first using theme tokens (good pilot). |

### Calendar (`Calendar/`)
| Issue | Fix |
|---|---|
| `DayCell.js:37` fixed `height: 85` × 6 rows + header ≈ 600pt → month doesn't fit on small screens; 9pt sub-label. | `height: (availableHeight)/6` via `onLayout`, or `aspectRatio: 0.8`; sub-label ≥ 10pt. |
| Today/selected state only by colour. | Add a ring/bold text so it is visible for colour-blind users. |

### Hadith (`Hadith/`)
| Issue | Fix |
|---|---|
| `HadithCard.js` fixed `height: 40` rows with long book titles → truncation; 17 hard-coded hex colours. | `minHeight`, `numberOfLines={2}`, theme tokens. |
| Spinner-only loading. | Skeleton list rows. |

### Duas (`DuaNew/`)
| Issue | Fix |
|---|---|
| `DuaDetailNew.js:20` card width from module `Dimensions`; `paddingRight: width - CARD_WIDTH - 20` hack for last card. | `useWindowDimensions`, `snapToInterval`, `contentContainerStyle={{ paddingHorizontal: (width-CARD_WIDTH)/2 }}`. |
| White theme file names differ (`DuasScreenWhite`, `BaseScreenClassWhite`) and status bar black on white. | Merge; theme `statusBar` token. |

### Islamic Stories (`IslamicStories/`)
| Issue | Fix |
|---|---|
| `screens/PlayStory.js:482–502` artwork `width: 200, height: 250, top: 50` → player controls pushed below the fold on small phones. | `width: '55%', aspectRatio: 0.8`, flex column with controls pinned bottom using insets. |
| `screens/AllSubCategories.js`, `ReadStoryDetail.js` module-level `Dimensions`. | `useWindowDimensions`. |
| 16 separate spinners. | Shared skeletons. |

### Reciters (`Reciters/`)
| Issue | Fix |
|---|---|
| `MiniPlayer.js:591` absolute `bottom: 30` → overlaps list's last row and the home indicator. | `bottom: insets.bottom + 8`; add `contentContainerStyle.paddingBottom = miniPlayerHeight` to the list. |
| `.png`/`.jpg` artwork stored inside the screen folder (3 copies). | Move to `src/assets`, share. |

### Videos (`VideosNew/`)
| Issue | Fix |
|---|---|
| `RecitaionDetailNew.js:6` card width computed at import. | Compute in render; use `numColumns` with `columnWrapperStyle={{ gap }}`. |
| Category navigation chosen by string compare (`"Durs and Podcast"`). | Route key in data. |
| 65 inline style objects. | Move to `StyleSheet`/themed `makeStyles`. |

### Reels (`Reel/`)
| Issue | Fix |
|---|---|
| `ShortsNew.js:6` falls back to module `height` (includes status/nav bar) until `onLayout` fires → first reel is taller than the viewport, paging misaligned. | Render list only after `onLayout`, use measured height; `getItemLayout`. |
| `keyExtractor` uses `uuid.v4()` fallback → new key every render, items remount (video restarts). | Use index fallback: `item._id ?? String(index)`. |

### Drawer screens (`Drawer/`)
| Issue | Fix |
|---|---|
| About / FAQs / Privacy / Contact / Rate / Founder / Hijri each ×3 files (21 files). | One file each + theme. |
| `FounderMsg.js:27` `ImageBackground` fixed `height: 320`, 155 literal font sizes, 231 inline styles. | `aspectRatio`, typography tokens. |
| `guestdrawernew.js:160` Share text always links to Google Play, also on iOS. | `Platform.select({ ios: appStoreUrl, android: playUrl })`. |
| `ContactUs` / `RateFeedback` inputs without keyboard handling. | `KeyboardAvoidingView`. |

### Onboarding (`onboarding/`)
| Issue | Fix |
|---|---|
| `OnbaordingItem.js:38` text block absolutely at `top: height*0.48` over a full-bleed image → overlaps artwork on short screens, leaves gap on tall. | Split image (top `flex: 0.55`) and text (`flex: 0.45`) or anchor text to `bottom: insets.bottom + paginatorHeight`. |
| `fontFamily: "Asul-Regular"` without Android variant. | Use `Fonts.heading`. |
| Filename typo `OnbaordingItem`. | Rename `OnboardingItem`. |

---

## Part 3 — Suggested order of work
1. **Quick wins (1 day)**: Tasbih `"Colors.white"` bug; Home duplicate focus listener; Quran `width: 396`; Greeting card `width: 400`; Reels `uuid` key; min font size 11; Wall form keyboard handling.
2. **Foundation (2–3 days)**: `SafeAreaProvider`, theme tokens, `metrics.js`, `fonts.js`, `AppText`, `IconButton`, `ScreenState`, single root `StatusBar`.
3. **Merge themes per module (1–2 days each)**: Qibla → Shahadah → Calendar → Reel → Greetings → Drawer → Dua → Hadith → Stories → Reciters → Videos → Wall → Home → Tasbih → Quran → Prayer (convert Prayer to data-driven `StepAccordion` while merging). Navigator collapses as you go.
4. **Polish**: skeleton loaders, retry states, accessibility labels, tablet layout check.
