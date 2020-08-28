import boto3
ec2 = boto3.client('ec2')


def evaluate_rules(ipPermission):
    ip_ranges_revoke = []
    for IpRange in ipPermission['IpRanges']:
        if int(IpRange['CidrIp'].split('/')[1]) < 24:
            ip_ranges_revoke.append(IpRange)
    print("revoke rule list", ip_ranges_revoke)
    return ip_ranges_revoke


def remove_ingress_rules(sg_group_id, ipPermission):
    ec2.revoke_security_group_ingress(GroupId=sg_group_id, IpPermissions=[ipPermission])


def remove_egress_rules(sg_group_id, ipPermission):
    ec2.revoke_security_group_egress(GroupId=sg_group_id, IpPermissions=[ipPermission])


def handler(event, context):
    print("Input event", event)
    group_id = event.get('detail').get('requestParameters').get('groupId')
    print("SG ID in scope", group_id)
    try:
        response = ec2.describe_security_groups(GroupIds=[group_id])
        for ipPermission in response['SecurityGroups'][0]['IpPermissions']:
            print("Before removing rule", ipPermission)
            if ipPermission['IpProtocol'] == 'tcp':
                if (ipPermission['FromPort'] <= 22 <= ipPermission['ToPort']) or (
                        ipPermission['FromPort'] <= 3389 <= ipPermission['ToPort']):
                    rules_to_remove = evaluate_rules(ipPermission)
                    if rules_to_remove:
                        ipPermission['IpRanges'] = rules_to_remove
                        remove_ingress_rules(group_id, ipPermission)
            if ipPermission['IpProtocol'] == '-1':
                rules_to_remove = evaluate_rules(ipPermission)
                if rules_to_remove:
                    ipPermission['IpRanges'] = rules_to_remove
                    remove_ingress_rules(group_id, ipPermission)

        for ipPermission in response['SecurityGroups'][0]['IpPermissionsEgress']:
            if ipPermission['IpProtocol'] == '-1':
                rules_to_remove = evaluate_rules(ipPermission)
                if rules_to_remove:
                    ipPermission['IpRanges'] = rules_to_remove
                    remove_egress_rules(group_id, ipPermission)
        return {"status_code": 200}
    except Exception as e:
        print(e)
        return {"status_code": 400}

