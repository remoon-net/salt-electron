package net.remoon.salt;

import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import libvpn.Libvpn;

@CapacitorPlugin(name = "Xhe")
public class XhePlugin extends Plugin {
    @Override
    public void load() {
        try {
            Libvpn.set("android_release_version","",String.valueOf(android.os.Build.VERSION.RELEASE));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        super.load();
    }

    private static final int VPN_REQUEST_CODE = 1001;

    @PluginMethod()
    public void start(PluginCall call) throws Exception {
        var vtun =Libvpn.get("VTun");
        if(!vtun.equals("")){
            Libvpn.start(Libvpn.TargetAll);
            call.resolve();
            return;
        }
        var ctx = getContext();
        var intent = VpnService.prepare(ctx);
        if( intent != null) {
            startActivityForResult(call,intent,VPN_REQUEST_CODE);
            call.reject("VPN 权限请求中");
            return;
        }

        var vpn = new Intent(ctx, VpnService.class);
        ctx.startService(vpn);

        call.resolve();
    }

    @PluginMethod()
    public void stop(PluginCall call) throws Exception {
//        var ctx = getContext();
//        var vpn = new Intent(ctx, VpnService.class);
//        ctx.stopService(vpn);
        Libvpn.stop(Libvpn.TargetAll);
        call.resolve();
    }

    private boolean initialized = false;

    @PluginMethod()
    public void set(PluginCall call) throws Exception {
        var selector = call.getString("selector");
        var action = call.getString("action");
        var value = call.getString("value");
        var initConfig = selector.equals("settings") && action.equals("init");
        if(initConfig && initialized){
            call.resolve();
            return;
        }
        Libvpn.set(selector, action, value);
        if(initConfig){
            initialized = true;
        }
        call.resolve();
    }

    @PluginMethod()
    public void get(PluginCall call) throws Exception {
        var selector = call.getString("selector");
        var s = Libvpn.get(selector);
        JSObject ret = new JSObject();
        ret.put("value", s);
        call.resolve(ret);
    }

}
