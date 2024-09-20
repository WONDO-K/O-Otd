package com.ootd

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

// Add for SplashScreen by Ethan
import android.os.Bundle
import org.devio.rn.splashscreen.SplashScreen
// import com.cboy.rn.splashscreen.SplashScreen


class MainActivity : ReactActivity() {

  // Add for SplashScreen by Ethan
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(savedInstanceState)
  }

  override fun onResume() {
    super.onResume()
    SplashScreen.hide(this)
  }


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ootd"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
