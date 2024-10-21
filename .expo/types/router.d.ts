/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(Onboarding)` | `/(Onboarding)/OnboardingOne` | `/(Onboarding)/OnboardingThree` | `/(Onboarding)/OnboardingTwo` | `/(auth)` | `/(auth)/Login` | `/(auth)/Register` | `/(camera)` | `/(camera)/Camera` | `/(chat)` | `/(chat)/Chatbot` | `/(chat)/LoadingDots` | `/(diet)` | `/(diet)/diet` | `/(graph)` | `/(graph)/graph` | `/(home)` | `/(home)/HomeScreen` | `/Camera` | `/Chatbot` | `/HomeScreen` | `/LoadingDots` | `/Login` | `/OnboardingOne` | `/OnboardingThree` | `/OnboardingTwo` | `/Register` | `/_sitemap` | `/diet` | `/graph`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
