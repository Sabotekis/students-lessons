package com.reactnative

import android.app.*
import android.content.*
import android.graphics.BitmapFactory
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.*

class NotificationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext

    override fun getName(): String {
        return "NotificationModule"
    }

    @ReactMethod
    fun createAndShowNotification() {
        val NOTIFICATION_CHANNEL_ID = "this_is_id"
        val notificationId = 123

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name: CharSequence = "Darba laika paziņojumi"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val notificationChannel = NotificationChannel(NOTIFICATION_CHANNEL_ID, name, importance)
            val notificationManager = context.getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(notificationChannel)
        }

        val intent = Intent(context, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("Darbs veiksmīgi uzsākts")
            .setContentText("Jūsu atrašanās vieta tiek izsekota")
            .setLargeIcon(BitmapFactory.decodeResource(context.resources, android.R.drawable.ic_dialog_info))
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(notificationId, builder.build())
    }

    @ReactMethod
    fun clearNotification() {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.cancel(123)
    }
}
