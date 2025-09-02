package com.reactnative

import android.app.*
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.location.Location
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.content.pm.PackageManager
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class ForegroundService : Service() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private val handler = Handler(Looper.getMainLooper())
    private val intervalMs = 5000L
    private var running = false
    private var lastLocation: Location? = null

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(result: LocationResult) {
            super.onLocationResult(result)
            if (result.locations.isNotEmpty()) {
                lastLocation = result.lastLocation
            }
        }
    }

    private val sendRunnable = object : Runnable {
        override fun run() {
            lastLocation?.let { loc ->
                sendCoordinatesToServer(loc.latitude, loc.longitude)
            }
            if (running) {
                handler.postDelayed(this, intervalMs)
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val channelId = "foreground_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Foreground Service Channel",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Darbs veiksmīgi uzsākts")
            .setContentText("Jūsu atrašanās vieta tiek izsekota")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setLargeIcon(BitmapFactory.decodeResource(resources, android.R.drawable.ic_dialog_info))
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(1, notification)

        startLocationUpdates()
        running = true
        handler.post(sendRunnable)

        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        running = false
        handler.removeCallbacks(sendRunnable)

        if (::fusedLocationClient.isInitialized) {
            fusedLocationClient.removeLocationUpdates(locationCallback)
        }

        stopForeground(STOP_FOREGROUND_REMOVE)

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.cancel(1)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startLocationUpdates() {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        val request = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            2000
        ).build()

        try {
            if (checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                android.util.Log.e("ForegroundService", "Location permissions not granted inside service")
                return
            }


            fusedLocationClient.requestLocationUpdates(
                request,
                locationCallback,
                Looper.getMainLooper()
            )
            android.util.Log.d("ForegroundService", "Location updates started")
        } catch (e: Exception) {
            android.util.Log.e("ForegroundService", "Failed to start location updates", e)
        }
    }


    private fun sendCoordinatesToServer(lat: Double, lng: Double) {
        Thread {
            try {
                val url = URL("http://192.168.200.173:5000/api/users/coordinates")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")

                val json = """{"latitude":$lat,"longitude":$lng}"""
                conn.outputStream.use { os ->
                    OutputStreamWriter(os).use { writer ->
                        writer.write(json)
                        writer.flush()
                    }
                }

                val responseCode = conn.responseCode
                android.util.Log.d("ForegroundService", "POST /users/coordinates response=$responseCode")
                conn.disconnect()
            } catch (e: Exception) {
                android.util.Log.e("ForegroundService", "Failed to send coordinates", e)
            }
        }.start()
    }

}
