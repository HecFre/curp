import 'package:arsus/views/pages/embedded_web/embedded_web_widget.dart';
import 'package:flutter/material.dart';

import 'App.dart';

class SandboxWeb extends App {
  SandboxWeb(Map<String, dynamic> appData): super(appData: appData);
  @override
  Function onTap(BuildContext context) {
    return () => Navigator.push(context, MaterialPageRoute(builder: (context) => EmbeddedWebPage(url: appData["webURL"])));
  }
}
