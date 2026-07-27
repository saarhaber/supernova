# Supernova 📚✨

The mobile app for book lovers — scan a book's barcode or search by title to see critic
reviews, browse the New York Times Best Sellers lists, and keep a favorites shelf that
syncs across your devices.

### Created By: Saar Haber, Nelson Lim, Jeffrey Chen

**Version 2.0** is a full rewrite: the original React Native / Expo / AWS Amplify app is
now a native Android app built with **Kotlin** and **Jetpack Compose**.

## Features

- **NYT Best Sellers** — browse five NYT lists (Fiction, Nonfiction, Paperback Fiction,
  Young Adult, Middle Grade) with covers, descriptions, and buy links.
- **Search** — find any book by title, author, or ISBN via the Google Books API, with
  critic reviews from iDreamBooks.
- **Barcode scanning** — scan a book's ISBN barcode straight from the search bar using
  Google's ML Kit code scanner (no camera permission required).
- **Favorites** — save books to a per-user shelf stored in Cloud Firestore with realtime
  sync and offline support.
- **Accounts** — email/password sign-in, sign-up, and password reset via Firebase
  Authentication.

The old "Book Events" feature was removed — its backing API (booksigningevent.com) is
dead — and with it the app no longer uses location at all.

## Tech stack

| Layer | Choice |
|---|---|
| Language | Kotlin 2.1 |
| UI | Jetpack Compose + Material 3 (dynamic color, dark theme, edge-to-edge) |
| Architecture | MVVM — ViewModel + StateFlow + coroutines |
| Navigation | Navigation Compose with bottom navigation bar |
| Networking | Retrofit + OkHttp + kotlinx.serialization |
| Images | Coil |
| Auth | Firebase Authentication (replaces AWS Amplify/Cognito) |
| Favorites | Cloud Firestore (replaces AWS AppSync/GraphQL) |
| Barcode | ML Kit / Google code scanner (`play-services-code-scanner`) |
| Build | Gradle 8.14, AGP 8.11, version catalog, `compileSdk`/`targetSdk` 36, `minSdk` 26 |

Targeting API 36 (Android 16) satisfies Google Play's current target-API-level requirement.

## Getting started

1. **Firebase setup (required):** the tracked `app/google-services.json` is a placeholder
   so the project compiles. Create a project in the [Firebase console](https://console.firebase.google.com/),
   add an Android app with package name `com.saarhaber.supernova`, enable
   **Authentication → Email/Password** and **Cloud Firestore**, then download the real
   `google-services.json` into `app/` (don't commit it).

   Suggested Firestore security rules:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/favorites/{bookId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

2. **API keys (required for the Best Sellers screen):** keys are never committed to the
   repository. Supply them in `~/.gradle/gradle.properties` (or the environment variables
   `SUPERNOVA_NYT_API_KEY` / `SUPERNOVA_IDREAMBOOKS_API_KEY`, e.g. as CI secrets):

   ```properties
   supernova.nytApiKey=YOUR_NYT_KEY
   supernova.idreamBooksApiKey=YOUR_IDREAMBOOKS_KEY
   ```

   > ⚠️ The keys that shipped inside earlier versions of this repository (an NYT key, an
   > iDreamBooks key, and a Google API key in the old `screens/Home.js`) are still visible
   > in git history and must be treated as compromised: rotate or delete them in their
   > respective consoles and restrict any replacement Google keys by app package +
   > SHA-1 fingerprint.

3. **Build:**

   ```bash
   ./gradlew assembleDebug
   ```

   Or open the project in Android Studio and run it.

## Project layout

```
app/src/main/java/com/saarhaber/supernova/
├── SupernovaApp.kt          # Application + dependency container
├── MainActivity.kt
├── data/
│   ├── AppContainer.kt      # Retrofit/Firebase wiring
│   ├── AuthRepository.kt    # Firebase Auth
│   ├── FavoritesRepository.kt  # Firestore favorites
│   ├── BooksRepository.kt   # NYT / Google Books / iDreamBooks
│   ├── model/               # UI-facing models
│   └── remote/              # Retrofit APIs + DTOs
└── ui/
    ├── SupernovaRoot.kt     # Auth gate + bottom navigation
    ├── auth/                # Sign in / sign up / reset
    ├── home/                # NYT best sellers
    ├── search/              # Search + barcode scan + reviews
    ├── favorites/           # Favorites shelf
    ├── profile/             # Account + sign out
    ├── components/          # Shared book card
    └── theme/               # Material 3 theme
```

---

**Privacy Policy**

Saar Haber built the Supernova app as a Free app. This SERVICE is provided by Saar Haber at no cost and is intended for use as is.

This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service.

If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy.

The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Supernova unless otherwise defined in this Privacy Policy.

**Information Collection and Use**

For a better experience, while using our Service, I may require you to provide us with certain personally identifiable information — an email address and password used to create your account. Authentication and your favorites list are handled by Google Firebase (Firebase Authentication and Cloud Firestore); your favorites are stored against your account so they can sync across your devices.

The app does use third party services that may collect information used to identify you.

Link to privacy policy of third party service providers used by the app

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase](https://firebase.google.com/support/privacy)

**Log Data**

I want to inform you that whenever you use my Service, in a case of an error in the app I collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing my Service, the time and date of your use of the Service, and other statistics.

**Cookies**

Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.

This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.

**Service Providers**

I may employ third-party companies and individuals due to the following reasons:

*   To facilitate our Service;
*   To provide the Service on our behalf;
*   To perform Service-related services; or
*   To assist us in analyzing how our Service is used.

I want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.

**Security**

I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.

**Links to Other Sites**

This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

**Children’s Privacy**

These Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13\. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to do necessary actions.

**Changes to This Privacy Policy**

I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page.

This policy is effective as of 2020-12-12

**Contact Us**

If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at dev.supernova.dev@gmail.com.

This privacy policy page was created at [privacypolicytemplate.net](https://privacypolicytemplate.net) and modified/generated by [App Privacy Policy Generator](https://app-privacy-policy-generator.nisrulz.com/)
