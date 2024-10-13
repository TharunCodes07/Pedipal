/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(Onboarding)` | `/(Onboarding)/OnboardingOne` | `/(Onboarding)/OnboardingThree` | `/(Onboarding)/OnboardingTwo` | `/(auth)` | `/(auth)/Login` | `/(auth)/Register` | `/(home)` | `/(home)/HomeScreen` | `/(pages)/Chatbot` | `/Chatbot` | `/HomeScreen` | `/Login` | `/OnboardingOne` | `/OnboardingThree` | `/OnboardingTwo` | `/Register` | `/_sitemap`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
