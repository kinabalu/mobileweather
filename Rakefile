# 
# Titanium mobile Rakefile for iOS build
# 

DEV_PROVISIONING_UUID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
DEV_SIGN = "Mystic Coders, LLC"
DEV_APP_NAME = "mobileweather"
DEV_APP_ID = 'com.mysticcoders.mobileweather'
DEV_APP_DEVICE = 'iphone'
USER_ROOT = "/your/root/path"

TITANIUM_SDK_VERSION = '2.1.3.GA'
IPHONE_SDK_VERSION = '6.0'
BUILDER = "#{USER_ROOT}/Library/Application Support/Titanium/mobilesdk/osx/#{TITANIUM_SDK_VERSION}/iphone/builder.py"
PROJDIR = "#{USER_ROOT}/Source/iphone/mobileweather/"

# Run app in iOS simulator
task :run do
  sh BUILDER, 'run', PROJDIR, IPHONE_SDK_VERSION, DEV_APP_ID, DEV_APP_NAME, DEV_APP_DEVICE
end

task :install do
  sh BUILDER, 'install', IPHONE_SDK_VERSION, PROJDIR, DEV_APP_ID, DEV_APP_NAME, DEV_PROVISIONING_UUID, DEV_SIGN, DEV_APP_DEVICE
end

task :distribute do
  sh BUILDER, 'distribute', IPHONE_SDK_VERSION, PROJDIR, DEV_APP_ID, DEV_APP_NAME, DEV_PROVISIONING_UUID, DEV_SIGN, '#{PROJDIR}build/adhoc', DEV_APP_DEVICE
end

# build an IPA adhoc file and create a zip file with the mobile provision file embedded within (the IPA file can be uploaded to TestFlight; the zip file is useful for testers installing via iTunes/iPhone Configuration Utility)
# create zip file with the dSYM file to symbolicate crash dumps (can upload this directly to TestFlight, for example)
# keep all files in a dated folder under the build/adhoc folder
task :adhoc => [:distribute] do
  version = "#{DEV_APP_NAME}-#{Time.now.strftime("%Y%m%d-%H%M%S")}"
  FileUtils.mkdir_p "build/adhoc/#{version}"
  File.open("build/adhoc/#{version}/version.txt",'w') do |f|
    f.puts(version)
  end
  sh "/usr/bin/xcrun", "-sdk", "iphoneos", "PackageApplication", "-v", "build/iphone/build/Release-iphoneos/#{DEV_APP_NAME}.app", "-o", "#{PROJDIR}build/adhoc/#{version}/#{version}.ipa"
  FileUtils.cp File.expand_path("~/Library/MobileDevice/Provisioning Profiles/#{DEV_PROVISIONING_UUID}.mobileprovision"), "build/adhoc/#{version}/#{DEV_APP_NAME}-dev.mobileprovision"
  sh 'ditto', '-ck', '--keepParent', '--sequesterRsrc', "build/adhoc/#{version}", "build/adhoc/#{version}.zip"
  sh 'ditto', '-ck', '--keepParent', '--sequesterRsrc', "build/iphone/build/Release-iphoneos/#{DEV_APP_NAME}.app.dSYM", "build/adhoc/#{version}-dSYM.zip"
  puts "[INFO] Zipped AdHoc: build/adhoc/#{version}.zip"
end

task :log do
  sh 'cat build/iphone/build/build.log'
end

task :clean do
  FileUtils.rm_rf "build/iphone"
  FileUtils.mkdir_p "build/iphone"
end