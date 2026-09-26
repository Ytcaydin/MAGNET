# Google Play Data Safety — Draft for V4.8.0

Based on the current source/build configuration, before any advertising SDK is added:

- Does the app collect data? No remote collection is implemented.
- Does the app share data with third parties? No remote sharing is implemented.
- Is account creation required? No.
- Is personal information requested from players? No.
- Is gameplay progress stored? Yes, locally on the device.
- Can users request deletion? Local progress can be deleted with Reset Progress; no server account exists.

Important: if an advertising SDK is added, this draft must be reviewed against that SDK's actual data practices before publishing.
