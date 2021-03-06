package com.sweetcow.sweetcow;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.magus.fblogin.FacebookLoginPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

//public class MainApplication extends Application implements ReactApplication {
//
//  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//    @Override
//    public boolean getUseDeveloperSupport() {
//      return BuildConfig.DEBUG;
//    }
//
//    @Override
//    protected List<ReactPackage> getPackages() {
//      return Arrays.<ReactPackage>asList(
//          new MainReactPackage(),
            new FacebookLoginPackage(),
//            new FIRMessagingPackage(),
//            new RNSpinkitPackage(),
//            new MapsPackage()
//      );
//    }
//  };
//
//  @Override
//  public ReactNativeHost getReactNativeHost() {
//    return mReactNativeHost;
//  }
//
//  @Override
//  public void onCreate() {
//    super.onCreate();
//    SoLoader.init(this, /* native exopackage */ false);
//  }
//}


public class MainApplication extends Application
implements ReactApplication {
    
    private static CallbackManager mCallbackManager =
    CallbackManager.Factory.create();
    
    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }
    
    private final ReactNativeHost mReactNativeHost =
    new ReactNativeHost(this) {
    
    @Override
    public boolean getUseDeveloperSupport() {
    return BuildConfig.DEBUG;
}

@Override
protected List<ReactPackage> getPackages() {
return Arrays.<ReactPackage>asList(
new MainReactPackage(),
        new FIRMessagingPackage(),
new MapsPackage(),
new FBSDKPackage(mCallbackManager)
);
}
};

@Override
public ReactNativeHost getReactNativeHost() {
return mReactNativeHost;
}

@Override
public void onCreate() {
super.onCreate();
SoLoader.init(this, /* native exopackage */ false);
}
}
