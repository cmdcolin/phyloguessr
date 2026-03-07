package com.phyloguessr

import android.app.Application
import coil.ImageLoader
import coil.ImageLoaderFactory
import okhttp3.Interceptor
import okhttp3.OkHttpClient

class PhyloGuessrApplication : Application(), ImageLoaderFactory {
    override fun newImageLoader() =
        ImageLoader.Builder(this)
            .okHttpClient(
                OkHttpClient.Builder()
                    .addNetworkInterceptor(Interceptor { chain ->
                        chain.proceed(
                            chain.request().newBuilder()
                                .header("User-Agent", "PhyloGuessrApp/1.0 (Android; colin.diesh@gmail.com)")
                                .build()
                        )
                    })
                    .build()
            )
            .build()
}
