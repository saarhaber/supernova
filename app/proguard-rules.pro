# Retrofit + kotlinx.serialization models
-keepattributes Signature, InnerClasses, EnclosingMethod, *Annotation*
-keepclassmembers class com.saarhaber.supernova.data.** {
    *** Companion;
}
-keepclasseswithmembers class com.saarhaber.supernova.data.** {
    kotlinx.serialization.KSerializer serializer(...);
}
-dontwarn okhttp3.internal.platform.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**
