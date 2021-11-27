# Android Native App Development by Rust

## Environment

- OS: Windows 10
    - Shell: PowerShell
    - Package Manager: Chocolatey
- Editor: VSCode
- Rust: `1.56.1`
    - Cargo: `1.56.0`
        - cargo-edit: `0.8.0`
        - cargo-generate: `0.10.3`

### Setup
Execute following commands in PowerShell (Administration)

```powershell
# --- skip following ---
# install visual c++ 2019 community (size: ~10GB, time: ~1H) by chocolatey
## workloads: https://docs.microsoft.com/ja-jp/visualstudio/install/workload-component-id-vs-community?view=vs-2019&preserve-view=true
### Microsoft.VisualStudio.Workload.NativeDesktop: C++ native desktop development
### Microsoft.VisualStudio.Workload.NativeCrossPlat: C++ native Linux development
### Microsoft.VisualStudio.Workload.NativeMobile: C++ native mobile (Android) development
### Microsoft.VisualStudio.Workload.NetCrossPlat: .NET mobile (Xamarin) development
# > choco install -y visualstudio2019community --package-parameters "--add Microsoft.VisualStudio.Workload.NativeCrossPlat --add Microsoft.VisualStudio.Workload.NativeDesktop --add Microsoft.VisualStudio.Workload.NativeMobile --add Microsoft.VisualStudio.Workload.NetCrossPlat --includeRecommended --includeOptional --passive"

# install android studio (~1GB) by chocolatey
# > choco install -y androidstudio

## => installed to C:\Program Files\Android\Android Studio

# install cygwin (unix system compatible layer: ~150MB) by chocolatey
> choco install -y mingw

## => installed to C:\tools\cygwin

# install Open JDK 8 (~100MB) by chocolatey
> choco install -y openjdk8

## => installed to C:\Program Files\OpenJDK\jdk-<version>

# set $JAVA_HOME to user environment variable
> [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\OpenJDK\openjdk-8u312-b07", "User")

# install android-sdk (~150MB) by chocolatey
> choco install -y android-sdk

## => installed to C:\Android\android-sdk

# set $ANDROID_SDK_ROOT to user environment variable
> [System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "C:\Android\android-sdk", "User")

# remove $ANDROID_HOME environment variable
> [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "", "User")
> [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "", "Machine")

# install android-ndk (~1GB) by chocolatey
> choco install -y android-ndk

## => installed to C:\Android\android-ndk-<version>

# set $ANDROID_NDK_ROOT to user environmental variables
# * following is example for the case if android-ndk version is `r21e`
> [System.Environment]::SetEnvironmentVariable("ANDROID_NDK_ROOT", "C:\Android\android-ndk-r21e", "User")

> exit
# --- restart powershell to reflect environment variables ---

# install tools by android sdk manager
# * sdkmanager: C:\Android\android-sdk\tools\bin\sdkmanager.bat
# * @see https://developer.android.com/studio/command-line/sdkmanager?hl=ja
> sdkmanager "build-tools;28.0.3"
> sdkmanager "platforms;android-28"

# --- skip following (instead, use BlueStacks android emulator) ---
# install (create) android emulator
## following command is installation of 32bit intel cpu architecture
# > sdkmanager "system-images;android-28;google_apis;x86"
# > avdmanager --verbose create avd --force --name "generic_9.0" --package "system-images;android-28;google_apis;x86" --tag "google_apis" --abi "x86"

# start android emulator
# > C:\Android\android-sdk\emulator\emulator "@generic_9.0"

# install cargo-apk crate
> cargo install cargo-apk

# add rust compile targets
> rustup target add armv7-linux-androideabi
> rustup target add aarch64-linux-android
> rustup target add i686-linux-android
> rustup target add x86_64-linux-android
```

### Setup BlueStacks
- BlueStacks:
    - Fast and lightweight android emulator
    - Available in Hyper-V environment (can coexist with WSL2)
    - OpenGL or DirectX available
- Download and install [BlueStacks 5](https://www.bluestacks.com/ja/bluestacks-5.html)
- Launch BlueStacks
    - Setting > Advanced:
        - Android Debug Bridge: `ON`
            - ![bluestacks_setting.drawio.png](./img/bluestacks_setting.drawio.png)
        - => Save
    - Restart BlueStacks
    - Setting > Advanced:
        - Android Debug Bridge:
            - Memorize the ADB port: `127.0.0.1:53705`
                - ※ This port is changed every time BlueStacks is launched

### Hello World JNI by Rust
- Rust bindings to the Android NDK: https://github.com/rust-windowing/android-ndk-rs

```powershell
# create new project: `helloworld`
> cargo new helloworld
> code helloworld
```

#### Edit `Cargo.toml` like following
```toml:Cargo.toml
[package]
name = "helloworld"
version = "0.1.0"
edition = "2021"

[dependencies]
ndk-sys = { git = "https://github.com/rust-windowing/android-ndk-rs" }
ndk = { git = "https://github.com/rust-windowing/android-ndk-rs" }
ndk-glue = { git = "https://github.com/rust-windowing/android-ndk-rs" }
ndk-build = { git = "https://github.com/rust-windowing/android-ndk-rs" }

[lib]
crate-type = ["lib", "cdylib"]
```

#### Edit `src/lib.rs` like following
```rust:src/lib.rs
#[cfg_attr(target_os = "android", ndk_glue::main(backtrace = "on"))]
pub fn main() {
    println!("hello world");
}
```

#### Edit `src/main.rs` like following
```rust:src/main.rs
fn main() {
    helloworld::main(); // call main function of this crate (src/lib.rs#main)
}
```

#### Build and launch
```powershell
# connect to BlueStacks android debug bridge
# * adb: C:\Android\android-sdk\platform-tools\adb.exe
# * floowing is example for the case if the BlueStacks is launching in 127.0.0.1:53705
> adb connect 127.0.0.1:53705

# confirm current connected devices
> adb devices

List of devices attached
127.0.0.1:53705 device

# compile helloworld crate as Android APK, and execute in BlueStacks emulator
> cargo apk run

    Compiling helloworld v0.1.0
    :
Verification succesful
Performing Streamed Install
Success
Starting: Intent { act=android.intent.action.MAIN cmp=rust.helloworld/android.app.NativeActivity }

# if you want to compile as Android 32bit intel cpu architecture, execute following command
> cargo apk run --target i686-linux-android

# display stdout|stderr in the emulator
## => if `hello world` is displayed, sample program is ok
> adb logcat RustStdoutStderr:D *:S

--------- beginning of main
--------- beginning of system
11-28 01:40:42.522  4189  4211 I RustStdoutStderr: hello world
```
