using System;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;
using static VrmAnimationJson;

public class WebSocketSender : MonoBehaviour {

    [SerializeField] private string characterName;
    [SerializeField] private Animator animator;
    [SerializeField] private Transform rootBone;

    private WebSocket webSocket;
    private HumanPose humanPose = new HumanPose ();
    private readonly VrmAnimationJson anime = new VrmAnimationJson ();

    void Start () {
        this.LoadBone ();
        this.StartWebsocket ();
    }

    void Update () {

        if (!webSocket.IsAlive) {
            webSocket.Connect ();
            return;
        }

        this.UpdateBone ();
        this.UpdateWebsocket ();
    }

    private void OnDestroy () {
        if (webSocket != null) webSocket.Close ();
    }

    private void StartWebsocket () {
        Debug.Log ("WebsocketAccessor Start");
        webSocket = new WebSocket ("ws://localhost:5001/");
        webSocket.OnOpen += (sender, e) => { Debug.Log ("Opended"); };
        webSocket.OnMessage += (sender, e) => { };
        webSocket.Connect ();
    }

    private void UpdateWebsocket () {
        Debug.Log ("WebsocketAccessor Update");
        try {
            webSocket.Send (JsonUtility.ToJson (this.anime));
        } catch (Exception e) {
            Debug.Log (e);
        }
    }

    private void LoadBone () {
        for (int i = 0; i <= 54; i++) {
            Transform bone = GetComponent<Animator> ().GetBoneTransform ((HumanBodyBones) i);
            this.anime.vrmAnimation.Add (new VrmAnimation ());
            this.anime.vrmAnimation[i].keys.Add (new Key ());
        }
    }

    private void UpdateBone () {
        Animator animator = GetComponent<Animator> ();
        HumanPoseHandler humanPoseHandler = new HumanPoseHandler (animator.avatar, this.rootBone);
        humanPoseHandler.GetHumanPose (ref humanPose);

        for (int i = 0; i <= 54; i++) {
            Transform bone = GetComponent<Animator> ().GetBoneTransform ((HumanBodyBones) i);
            if (bone == null) continue;
            float[] pos = new float[3] { bone.localPosition.x, bone.localPosition.y, bone.localPosition.z };
            float[] rot = new float[4] { bone.localRotation.x, bone.localRotation.y, bone.localRotation.z, bone.localRotation.w };
            float[] scl = new float[3] { bone.localScale.x, bone.localScale.y, bone.localScale.z };
            this.anime.vrmAnimation[i].name = "" + i;
            this.anime.vrmAnimation[i].bone = bone.name;
            this.anime.vrmAnimation[i].keys[0] = new Key (pos, rot, scl, 0);
        }
    }
}

[Serializable]
public class VrmAnimationJson {

    public List<VrmAnimation> vrmAnimation = new List<VrmAnimation> ();

    [Serializable]
    public class VrmAnimation {
        public string name = "";
        public string bone = "";
        public List<Key> keys = new List<Key> ();
    }

    [Serializable]
    public class Key {
        public float[] pos;
        public float[] rot;
        public float[] scl;
        public long time;

        public Key (float[] pos, float[] rot, float[] scl, long time) {
            this.pos = pos;
            this.rot = rot;
            this.scl = scl;
            this.time = time;
        }

        public Key () { }
    }
}