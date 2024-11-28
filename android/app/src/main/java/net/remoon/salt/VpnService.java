package net.remoon.salt;

import android.content.Intent;
import org.json.JSONArray;
import inet.ipaddr.IPAddressString;
import libvpn.Libvpn;

public class VpnService extends android.net.VpnService {
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {
            setupVpn();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return super.onStartCommand(intent, flags, startId);
    }

    private void setupVpn() throws Exception {
        var builder = new Builder();
        builder.setSession("salt");
        var routesRaw = Libvpn.get("Route");
        var routes = new JSONArray(routesRaw);
        for (int i = 0; i < routes.length(); i++) {
            var route = routes.get(i).toString();
            var pf = new IPAddressString(route);
            var addr = pf.getAddress().toInetAddress();
            var prefix = pf.getNetworkPrefixLength();
            builder.addAddress(addr, prefix);
        }
        builder.setMtu(2400);
        builder.setBlocking(true);
        builder.addDisallowedApplication("net.remoon.salt");
        var tun = builder.establish();
        var fd = tun.detachFd();
        Libvpn.set("Tun", String.valueOf(fd));
        Libvpn.start();
    }

    @Override
    public void onDestroy() {
        Libvpn.stop();
        super.onDestroy();
    }

}
