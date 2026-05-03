# YNX iOS App Store Readiness

Status: native iOS prototype, App Store submission package scaffolded.

## Current App Identity

- App name: YNX
- Bundle ID: `com.ynxweb4.ynx`
- Version: `1.0.0`
- Build: `1`
- iPhone only, portrait orientation
- Public testnet only. Mainnet is not live.

## Included For Submission

- Native SwiftUI iOS app shell
- App icon asset catalog generated from the YNX blue/white mark
- Launch screen with YNX mark
- Privacy manifest declaring no tracking and no collected data
- Network, validators, AI/Web4 settlement, and docs surfaces
- Live endpoint checks with fallback copy that avoids implying mainnet value

## Required Before Real App Store Submission

- Replace generated logo assets with the final source PNG or vector master.
- Add App Store screenshots for 6.9-inch and 6.5-inch iPhone sizes.
- Add a production privacy policy URL on `ynxweb4.com`.
- Create App Store Connect metadata: subtitle, description, keywords, support URL, marketing URL.
- Confirm export compliance for cryptography and answer App Store Connect encryption questions.
- Add Apple Developer team signing in Xcode.
- Run on a physical iPhone and validate poor-network behavior.
- Prepare review notes explaining that YNX is a public testnet monitor and AI/Web4 settlement explainer; testnet tokens have no mainnet value.
