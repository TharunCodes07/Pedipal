/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(Camera)` | `/(Camera)/Camera` | `/(Onboarding)` | `/(Onboarding)/OnboardingOne` | `/(Onboarding)/OnboardingThree` | `/(Onboarding)/OnboardingTwo` | `/(auth)` | `/(auth)/Login` | `/(auth)/Register` | `/(chat)` | `/(chat)/Chatbot` | `/(home)` | `/(home)/HomeScreen` | `/(pages)` | `/(pages)/Chatbot` | `/Camera` | `/Chatbot` | `/HomeScreen` | `/Login` | `/OnboardingOne` | `/OnboardingThree` | `/OnboardingTwo` | `/Register` | `/_sitemap`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
