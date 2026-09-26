# MAGNET V4.8.0 — Store QA

## Automated checks
- Package/application ID present: PASS
- targetSdk 35: PASS
- No Android INTERNET permission in current build: PASS
- No billing/purchase dependency: PASS
- No premium UI/state in game: PASS
- Ad policy is limited to completed levels 5,10,15,...: PASS
- Privacy policy TR + EN included: PASS
- Version name/code synchronized: PASS
- Web and Android game assets synchronized: PASS

## Store submission blockers
1. A real signed AAB must be built before submission.
2. Developer/support email must be supplied and inserted into the privacy policy/store listing.
3. Privacy policy must be hosted at a public HTTPS URL.
4. If an ad SDK is connected, its SDK-specific data-safety disclosures and privacy wording must be added before release.
5. Final 512x512 store icon must be supplied/approved before submission.
6. Content rating questionnaire must be completed in Play Console.

## Current data handling
- Local gameplay progress: yes
- Account: no
- User-entered personal data: no
- Remote analytics: no
- Billing: no
- Advertising SDK: not connected in this build
