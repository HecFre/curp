import 'package:arsus/views/apps/app/AppWeb.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import 'RedirectWeb.dart';
import 'AppMobile.dart';
import 'SandboxWeb.dart';

abstract class App extends StatelessWidget {
  final Map<String, dynamic> appData;
  App({this.appData, Key key}) : super(key: key);

  static App factory(Map<String, dynamic> appData) {
    switch(appData["type"]) {
      case "appWeb":
        return AppWeb(appData);
      case "redirectWeb":
        return RedirectWeb(appData);
      case "sandboxWeb":
        return SandboxWeb(appData);
      case "appMobile":
        return AppMobile(appData);
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap(context),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          SvgPicture.network(
              appData["img"],
              semanticsLabel: appData["title"],
              width: 70,
              height: 70,
              fit: BoxFit.cover,
              placeholderBuilder: (BuildContext context) => Container(
                  padding: const EdgeInsets.all(30.0),
                  child: const CircularProgressIndicator()
              )
          ),
          Text(
            appData["title"],
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            softWrap: false,
            style: ArsusTheme.bodyText1.override(
                fontFamily: 'IBM Plex Sans',
                fontSize: 7
            ),
          )
        ],
      ),
    );
  }

  Function onTap(BuildContext context);
}

