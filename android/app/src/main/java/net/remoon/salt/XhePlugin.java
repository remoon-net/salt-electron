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
        var path = getContext().getFilesDir().getAbsolutePath();
        try {
            Libvpn.set("android_release_version",String.valueOf(android.os.Build.VERSION.RELEASE));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        super.load();
    }

    private static final int VPN_REQUEST_CODE = 1001;

    @PluginMethod()
    public void start(PluginCall call) throws Exception {
        var ctx = getContext();
        var intent = android.net.VpnService.prepare(ctx);
        if( intent != null) {
            startActivityForResult(call,intent,VPN_REQUEST_CODE);
        }

        var vpn = new Intent(ctx, net.remoon.salt.VpnService.class);
        ctx.startService(vpn);

        JSObject ret = new JSObject();
        ret.put("value", "666");
        call.resolve(ret);
    }

    @PluginMethod()
    public void stop(PluginCall call) {

        JSObject ret = new JSObject();
        ret.put("value", "stopped");
        call.resolve(ret);
    }

}
